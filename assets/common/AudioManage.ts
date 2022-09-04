class audioManage {
  effectVolume = 1
  musicVolume = 1
  effectIsClose = false
  musicIsClose = false

  playEffect(
    res: cc.AudioClip | string,
    loop: boolean = false,
    volume?: number
  ) {
    if (this.effectIsClose) {
      return
    }
    if (this.getEffectVolume() == 0) {
      return
    }
    if (res instanceof cc.AudioClip) {
      let audioID = cc.audioEngine.playEffect(res, loop)
      return audioID
    } else {
      if (res.substring(0, 4) == 'http') {
        cc.assetManager.loadRemote(res, (error, clip: cc.AudioClip) => {
          if (error) {
            cc.log(error)
            return
          }
          cc.audioEngine.playEffect(clip, loop)
        })
      } else {
        cc.resources.load(res, cc.AudioClip, (error, clip: cc.AudioClip) => {
          if (error) {
            cc.log(error)
            return
          }
          cc.audioEngine.playEffect(clip, loop)
        })
      }
    }
  }

  playMusic(
    res: cc.AudioClip | string,
    loop: boolean = false,
    volume?: number
  ) {
    if (this.musicIsClose) {
      return
    }
    if (this.getMusicVolume() == 0) {
      return
    }
    if (res instanceof cc.AudioClip) {
      let audioID = cc.audioEngine.playMusic(res, loop)
      return audioID
    } else {
      cc.resources.load(
        res,
        cc.AudioClip,
        null,
        (error, clip: cc.AudioClip) => {
          cc.audioEngine.playMusic(clip, loop)
        }
      )
    }
  }

  getEffectVolume() {
    let volume = cc.sys.localStorage.getItem('effectVolume') || 0.5
    this.effectVolume = parseFloat(volume)
    return this.effectVolume
  }

  setEffectVolume(volume: number) {
    if (volume == NaN) volume = 0.5
    cc.sys.localStorage.setItem('effectVolume', volume)
    cc.audioEngine.setEffectsVolume(volume)
    this.effectIsClose = volume == 0
  }

  getMusicVolume() {
    let volume = cc.sys.localStorage.getItem('musicVolume') || 0.5
    this.musicVolume = parseFloat(volume)
    return this.musicVolume
  }

  setMusicVolume(volume: number) {
    if (volume == NaN) volume = 0.5
    cc.sys.localStorage.setItem('musicVolume', volume)
    cc.audioEngine.setMusicVolume(volume)
    this.musicIsClose = volume == 0
  }
}

export const AudioManage = new audioManage()
