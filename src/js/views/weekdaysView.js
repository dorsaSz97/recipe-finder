class WeekdaysView {
  _parentElement = document.querySelector('.recipes');
  _data;

  // -----EVENT HANDLERS------
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', e => {
      const day = e.target.closest('.weekdays__btn');
      if (!day) return;

      // activate clicked day
      this._parentElement
        .querySelectorAll('.weekdays__btn')
        .forEach(b => b.classList.remove('active'));
      day.classList.add('active');

      handler(day.dataset.day);
    });
  }
}

export default new WeekdaysView();
