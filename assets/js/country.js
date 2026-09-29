(() => {
  const title = document.getElementById('country-title');
  const region = document.getElementById('country-region');
  const summary = document.getElementById('country-summary');
  const gallery = document.getElementById('country-gallery');
  const photoCount = document.getElementById('country-photo-count');
  const stories = document.getElementById('country-stories');
  const storyList = document.getElementById('country-story-list');
  if (!title || !gallery) return;

  const id = new URLSearchParams(location.search).get('country');
  const data = window.alexTravelData || { visitedCountries: [], destinations: [] };
  const saved = data.destinations.find(destination => destination.id === id);
  const features = window.worldAtlasData && window.topojson
    ? topojson.feature(window.worldAtlasData, window.worldAtlasData.objects.countries).features
    : [];
  const feature = features.find(country => String(country.id).padStart(3, '0') === id);
  const country = saved || (feature ? {
    id,
    name: feature.properties.name || 'Country',
    region: 'COUNTRY NOTES',
    summary: 'Add cities, trip notes and photographs for this country.',
    photos: [],
    articles: []
  } : null);

  if (!country) {
    title.textContent = 'Place not found';
    summary.textContent = 'Choose a country from the Travel atlas.';
    gallery.innerHTML = '<a href="travel.html">Return to the map →</a>';
    return;
  }

  document.title = `${country.name} | Travel notes | Alexander Tarasov`;
  const flag = data.countryFlags?.[id];
  title.replaceChildren();
  if (flag) {
    const icon = document.createElement('span');
    icon.className = 'country-emoji';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = flag;
    title.append(icon);
  }
  const countryName = document.createElement('span');
  countryName.className = 'country-name';
  countryName.textContent = country.name;
  title.append(countryName);
  if (window.typePageHeading) window.typePageHeading(countryName);
  region.textContent = country.region || (data.homeCountry === id ? 'Home · Berlin' : 'Travel notes');
  summary.textContent = country.summary || 'Cities, photographs and field notes from this country.';
  const photos = country.photos || [];
  photoCount.textContent = `${photos.length} ${photos.length === 1 ? 'PHOTO' : 'PHOTOS'}`;
  gallery.replaceChildren();

  if (!photos.length) {
    const empty = document.createElement('p');
    empty.className = 'country-gallery-empty';
    empty.textContent = 'No photographs yet. Add photos and captions in content/travel.js.';
    gallery.append(empty);
  } else {
    photos.forEach(photo => {
      const figure = document.createElement('figure');
      figure.className = 'country-photo';
      const open = document.createElement('button');
      open.type = 'button';
      open.className = 'photo-open country-photo-open';
      open.dataset.photoOpen = '';
      open.dataset.photoSrc = photo.src;
      open.dataset.photoAlt = photo.alt || `${country.name} travel photograph`;
      open.dataset.photoCaption = photo.caption || '';
      open.setAttribute('aria-label', `Open photograph: ${photo.caption || photo.alt || country.name}`);
      const image = document.createElement('img');
      image.src = photo.src;
      image.alt = photo.alt || `${country.name} travel photograph`;
      image.loading = 'lazy';
      open.append(image);
      figure.append(open);
      if (photo.caption) {
        const caption = document.createElement('figcaption');
        caption.textContent = photo.caption;
        figure.append(caption);
      }
      gallery.append(figure);
    });
  }

  const articles = country.articles || [];
  if (articles.length) {
    stories.hidden = false;
    articles.forEach(article => {
      const link = document.createElement('a');
      link.className = 'list-card';
      link.href = article.href;
      const detail = document.createElement('div');
      const heading = document.createElement('h3');
      heading.textContent = article.title;
      const date = document.createElement('span');
      date.className = 'date';
      date.textContent = article.date || 'TRIP NOTE';
      detail.append(heading);
      link.append(detail, date);
      storyList.append(link);
    });
  }
})();
