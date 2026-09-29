(() => {
  let dialog;

  function getDialog() {
    if (dialog) return dialog;
    dialog = document.createElement('dialog');
    dialog.className = 'photo-lightbox';
    dialog.setAttribute('aria-label', 'Photograph preview');
    dialog.innerHTML = '<button type="button" class="lightbox-close" aria-label="Close photograph">×</button><figure><img alt=""><figcaption></figcaption></figure>';
    dialog.addEventListener('click', event => {
      if (event.target === dialog || event.target.closest('.lightbox-close')) dialog.close();
    });
    document.body.append(dialog);
    return dialog;
  }

  document.addEventListener('click', event => {
    const trigger = event.target.closest?.('[data-photo-open]');
    if (!trigger) return;
    const preview = getDialog();
    const image = preview.querySelector('img');
    const caption = preview.querySelector('figcaption');
    image.src = trigger.dataset.photoSrc || '';
    image.alt = trigger.dataset.photoAlt || '';
    caption.textContent = trigger.dataset.photoCaption || trigger.dataset.photoAlt || '';
    preview.showModal();
  });
})();
