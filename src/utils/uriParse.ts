interface BilibiliUri {
  cid: string | null
  player_height: number | null
  player_preload: string | null
  player_rotate: number | null
  player_width: number | null
  report_flow_data: string | null
  trackid: string | null
}

export function isVerticalVideo(uri: string): boolean {
  const bilibiliUri = parseBilibiliUri(uri)
  if (bilibiliUri.player_height == null || bilibiliUri.player_width == null)
    return false

  return bilibiliUri.player_height > bilibiliUri.player_width
}

export function parseBilibiliUri(uri: string): BilibiliUri {
  const params = uri.split('?')[1]
  const searchParams = new URLSearchParams(params)
  return {
    cid: searchParams.get('cid'),
    player_height: searchParams.get('player_height') ? Number.parseInt(searchParams.get('player_height')!) : null,
    player_preload: searchParams.get('player_preload'),
    player_rotate: searchParams.get('player_rotate') ? Number.parseInt(searchParams.get('player_rotate')!) : null,
    player_width: searchParams.get('player_width') ? Number.parseInt(searchParams.get('player_width')!) : null,
    report_flow_data: searchParams.get('report_flow_data'),
    trackid: searchParams.get('trackid'),
  }
}
