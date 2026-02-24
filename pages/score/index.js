const SCORE_KEY = 'dulcimer_scores';

function formatTime(date = new Date()) {
  const pad = (v) => `${v}`.padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

Page({
  data: {
    scores: [],
    isEditing: false,
    editingId: '',
    form: {
      title: '',
      key: '',
      content: ''
    }
  },

  onShow() {
    this.loadScores();
  },

  onFieldInput(event) {
    const { field } = event.currentTarget.dataset;
    const { value } = event.detail;
    this.setData({ [`form.${field}`]: value });
  },

  loadScores() {
    const scores = wx.getStorageSync(SCORE_KEY) || [];
    this.setData({ scores });
  },

  saveToStorage(scores) {
    wx.setStorageSync(SCORE_KEY, scores);
    this.setData({ scores });
  },

  resetForm() {
    this.setData({
      form: { title: '', key: '', content: '' },
      isEditing: false,
      editingId: ''
    });
  },

  saveScore() {
    const { form, isEditing, editingId, scores } = this.data;
    const title = form.title.trim();
    const key = form.key.trim();
    const content = form.content.trim();

    if (!title || !content) {
      wx.showToast({ title: '名称和内容必填', icon: 'none' });
      return;
    }

    const updatedAt = formatTime();
    let nextScores = [...scores];

    if (isEditing) {
      nextScores = nextScores.map((item) =>
        item.id === editingId ? { ...item, title, key, content, updatedAt } : item
      );
    } else {
      nextScores.unshift({
        id: `${Date.now()}_${Math.random().toString(16).slice(2, 6)}`,
        title,
        key,
        content,
        updatedAt
      });
    }

    this.saveToStorage(nextScores);
    this.resetForm();
    wx.showToast({ title: isEditing ? '已更新' : '已新增', icon: 'success' });
  },

  editScore(event) {
    const { id } = event.currentTarget.dataset;
    const target = this.data.scores.find((item) => item.id === id);
    if (!target) return;

    this.setData({
      isEditing: true,
      editingId: id,
      form: {
        title: target.title,
        key: target.key,
        content: target.content
      }
    });
  },

  deleteScore(event) {
    const { id } = event.currentTarget.dataset;
    wx.showModal({
      title: '确认删除',
      content: '删除后不可恢复，是否继续？',
      success: (res) => {
        if (!res.confirm) return;
        const nextScores = this.data.scores.filter((item) => item.id !== id);
        this.saveToStorage(nextScores);
        if (this.data.editingId === id) {
          this.resetForm();
        }
        wx.showToast({ title: '已删除', icon: 'success' });
      }
    });
  },

  cancelEdit() {
    this.resetForm();
  }
});
