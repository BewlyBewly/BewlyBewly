interface BewlyProfileCardProvider {
  hasCacheUserProfile: (mid: number) => boolean
  openUserProfile: (mid: number, e: MouseEvent) => void
  closeUserProfile: (mid?: number) => void
}

export function useProfileCard(): BewlyProfileCardProvider {
  return inject('BEWLY_USER_PROFILE')!
}
