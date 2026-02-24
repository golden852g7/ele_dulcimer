const NOTES = [
  { name: 'C4', label: 'Do' },
  { name: 'D4', label: 'Re' },
  { name: 'E4', label: 'Mi' },
  { name: 'F4', label: 'Fa' },
  { name: 'G4', label: 'So' },
  { name: 'A4', label: 'La' },
  { name: 'B4', label: 'Si' },
  { name: 'C5', label: 'Do' },
  { name: 'D5', label: 'Re' },
  { name: 'E5', label: 'Mi' },
  { name: 'F5', label: 'Fa' },
  { name: 'G5', label: 'So' },
  { name: 'A5', label: 'La' },
  { name: 'B5', label: 'Si' }
];

Page({
  data: {
    notes: NOTES,
    currentNote: ''
  },

  onUnload() {
    this.releaseAudio();
  },

  onHide() {
    this.releaseAudio();
  },

  releaseAudio() {
    if (this.audioCtx) {
      this.audioCtx.stop();
      this.audioCtx.destroy();
      this.audioCtx = null;
    }
  },

  playNote(event) {
    const { note } = event.currentTarget.dataset;
    const src = `/assets/audio/${note}.mp3`;

    this.releaseAudio();
    const audioCtx = wx.createInnerAudioContext();
    this.audioCtx = audioCtx;
    audioCtx.src = src;
    audioCtx.autoplay = true;

    audioCtx.onError(() => {
      wx.showToast({
        title: `缺少音频: ${note}.mp3`,
        icon: 'none',
        duration: 1800
      });
    });

    this.setData({ currentNote: note });
  }
});
