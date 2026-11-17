import { useEffect, useMemo, useState } from 'react';
import { authorizationHeaders } from '../api/auth.js';
import { expSummary, fetchHome, fetchMyExp, fetchRanking } from '../api/learning.js';

const emptySummary = { exp: null, home: null, ranking: null };

export function useDashboardSummary() {
  const authorization = authorizationHeaders().Authorization;
  const [snapshot, setSnapshot] = useState(() => ({ authorization, ...emptySummary }));

  useEffect(() => {
    if (!authorization) return undefined;
    const controller = new AbortController();
    const { signal } = controller;
    const update = (key, value) => {
      if (signal.aborted) return;
      setSnapshot((current) => ({
        ...(current.authorization === authorization ? current : emptySummary),
        authorization,
        [key]: value,
      }));
    };
    fetchMyExp({ signal }).then((data) => update('exp', expSummary(data))).catch(() => {});
    fetchHome({ signal }).then((data) => update('home', data)).catch(() => {});
    fetchRanking({ page: 1, size: 3 }, { signal }).then((data) => update('ranking', data)).catch(() => {});
    return () => controller.abort();
  }, [authorization]);

  return useMemo(() => {
    const { exp, home, ranking } = snapshot.authorization === authorization ? snapshot : emptySummary;
    return { exp, home, ranking, loggedIn: Boolean(authorization) };
  }, [snapshot, authorization]);
}
