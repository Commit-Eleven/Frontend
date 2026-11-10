import { useEffect, useRef, useState } from 'react';
import { fetchCodeProblem, submitCodeAnswer } from '../api/codeProblems.js';
import { recordWrongAnswer, resolveWrongNoteForProblem } from '../lib/wrongNotes.js';

const emptyState = {
  status: 'idle', problem: null, code: '', result: null, error: '',
  authRequired: false, busy: false, showSuccess: false,
  completion: 'idle', completionError: '',
};

function readStorage(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

function writeStorage(key, value) {
  try { localStorage.setItem(key, value); } catch { /* 저장소를 사용할 수 없어도 제출은 가능합니다. */ }
}

function draftKey(language, lessonId, problemId) {
  return `codegram-code-draft-v1:${language}:${lessonId}:${problemId}`;
}

export function useCodeChallenge({ enabled, language, lesson, onSuccess }) {
  const [state, setState] = useState(emptyState);
  const [request, setRequest] = useState(0);
  const controllerRef = useRef(null);
  const busyRef = useRef(false);

  useEffect(() => {
    if (!enabled) return undefined;
    const controller = new AbortController();
    controllerRef.current = controller;
    busyRef.current = false;
    const selectionKey = `codegram-code-problem-v1:${language}:${lesson.id}`;
    setState({ ...emptyState, status: 'loading' });

    async function load() {
      try {
        const id = readStorage(selectionKey);
        let problem;
        try {
          problem = await fetchCodeProblem({ id, language, signal: controller.signal });
        } catch (error) {
          if (!id || error.status !== 404 || error.code === 'NotFound' || controller.signal.aborted) throw error;
          problem = await fetchCodeProblem({ language, signal: controller.signal });
        }
        if (controller.signal.aborted) return;
        writeStorage(selectionKey, problem.id);
        const code = readStorage(draftKey(language, lesson.id, problem.id)) ?? problem.content.starterCode;
        setState({ ...emptyState, status: 'ready', problem, code });
      } catch (error) {
        if (controller.signal.aborted) return;
        setState({
          ...emptyState,
          status: error.status === 401 ? 'auth-required' : error.status === 404 && error.code !== 'NotFound' ? 'unavailable' : 'error',
          error: error.code === 'NotFound' ? '현재 코드 실습을 이용할 수 없어요. 잠시 후 다시 시도해 주세요.' : error.message || '코드 문제를 불러오지 못했어요.',
        });
      }
    }
    load();
    return () => controller.abort();
  }, [enabled, language, lesson.id, request]);

  const changeCode = (code) => {
    if (busyRef.current || state.showSuccess || !state.problem) return;
    writeStorage(draftKey(language, lesson.id, state.problem.id), code);
    setState((current) => ({ ...current, code, result: null, error: '', authRequired: false, completion: 'idle', completionError: '' }));
  };

  const saveCompletion = async (signal) => {
    setState((current) => ({ ...current, showSuccess: true, completion: 'saving', completionError: '' }));
    try {
      await onSuccess(lesson.id, { signal });
      if (!signal.aborted) setState((current) => ({ ...current, completion: 'saved' }));
    } catch (error) {
      if (!signal.aborted) {
        setState((current) => ({
          ...current, completion: 'error', completionError: error.message || '완료 기록을 저장하지 못했어요.',
          authRequired: error.status === 401,
        }));
      }
    }
  };

  const submit = async () => {
    if (busyRef.current || state.showSuccess || state.status !== 'ready' || !state.code.trim()) return;
    const signal = controllerRef.current?.signal;
    if (!signal || signal.aborted) return;
    busyRef.current = true;
    setState((current) => ({ ...current, busy: true, result: null, error: '', authRequired: false, completion: 'idle', completionError: '', showSuccess: false }));
    try {
      const result = await submitCodeAnswer(state.problem.id, state.code, { signal });
      if (signal.aborted) return;
      setState((current) => ({ ...current, result }));
      const context = { language, lessonId: lesson.id, type: 'code', problemId: state.problem.id };
      if (result.correct) {
        resolveWrongNoteForProblem(context);
        await saveCompletion(signal);
      } else {
        recordWrongAnswer({
          ...context, lessonTitle: lesson.title, problem: state.problem,
          submittedAnswer: state.code,
          feedback: { correct: false, results: result.failed.map((label) => ({ label, passed: false })) },
          source: 'server-code',
        });
      }
    } catch (error) {
      if (!signal.aborted) {
        setState((current) => ({ ...current, error: error.message, authRequired: error.status === 401 }));
      }
    } finally {
      busyRef.current = false;
      if (!signal.aborted) setState((current) => ({ ...current, busy: false }));
    }
  };

  const retryCompletion = async () => {
    const signal = controllerRef.current?.signal;
    if (busyRef.current || !state.result?.correct || !signal || signal.aborted) return;
    busyRef.current = true;
    setState((current) => ({ ...current, busy: true }));
    try {
      await saveCompletion(signal);
    } finally {
      busyRef.current = false;
      if (!signal.aborted) setState((current) => ({ ...current, busy: false }));
    }
  };

  return {
    ...state, changeCode, submit, retryCompletion,
    reload: () => setRequest((value) => value + 1),
    closeSuccess: () => setState((current) => ({ ...current, showSuccess: false })),
  };
}
