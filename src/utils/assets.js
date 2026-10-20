export const A = '/coddy/'
/** 공용 Coddy 아이콘의 정적 경로를 반환합니다. */
export const icon = (name) => A + 'icons/' + name + '.svg'
/** 여정 지도 아이콘의 정적 경로를 반환합니다. */
export const journeyIcon = (name) => icon('journey/' + name)
