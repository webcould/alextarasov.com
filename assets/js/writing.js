(() => {
  const target = document.getElementById('article-list');
  if (!target) return;
  const articles = window.alexArticles || [];
  if (!articles.length) return;
  target.replaceChildren();
  articles.slice().sort((a, b) => (b.date || '').localeCompare(a.date || '')).forEach(article => {
      const link = document.createElement('a');
      link.className = 'list-card';
      link.href = article.href;
      const detail = document.createElement('div');
      const title = document.createElement('h3');
      const summary = document.createElement('p');
      const date = document.createElement('span');
      title.textContent = article.title;
      summary.textContent = article.summary || '';
      date.className = 'date';
      date.textContent = article.date || '';
      detail.append(title, summary);
      if (article.photo) {
        const image = document.createElement('img');
        image.className = 'writing-cover';
        image.src = article.photo;
        image.alt = article.alt || '';
        image.loading = 'lazy';
        detail.append(image);
      }
      link.append(detail, date);
      target.append(link);
  });
})();
