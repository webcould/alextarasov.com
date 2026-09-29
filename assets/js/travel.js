(() => {
  const map = document.getElementById('world-map');
  const status = document.getElementById('map-status');
  const panel = document.getElementById('country-panel');
  const places = document.getElementById('travel-places');
  if (!map || !status || !panel || !places) return;
  const ns = 'http://www.w3.org/2000/svg';
  let countryPaths = new Map();
  let mapSelection;
  let zoomController;
  const countryData = window.alexTravelData || { visitedCountries: [], destinations: [] };
  const flagFor = id => countryData.countryFlags?.[id] || '';
  let selectedId = null;
  const element = (tag, text, className) => {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    return node;
  };
  const worldFeatures = window.worldAtlasData && window.topojson
    ? topojson.feature(window.worldAtlasData, window.worldAtlasData.objects.countries).features
    : [];
  const countryNames = new Map(worldFeatures.map(country => [String(country.id).padStart(3, '0'), country.properties.name || 'Country']));
  const destinationIds = [...new Set([...countryData.visitedCountries, countryData.homeCountry].filter(Boolean))];
  const allDestinations = destinationIds.map(id => countryData.destinations.find(destination => destination.id === id) || ({
    id,
    name: countryNames.get(id) || `Country ${id}`,
    region: 'COUNTRY NOTES',
    summary: 'Add cities, trip notes and photographs for this country.',
    photos: [],
    articles: []
  }));
  const lookup = id => allDestinations.find(destination => destination.id === id);

  function clearSelection() {
    selectedId = null;
    countryPaths.forEach(path => {
      path.classList.remove('is-selected');
      path.setAttribute('aria-pressed', 'false');
    });
    panel.replaceChildren(
      element('div', 'TRAVEL NOTES', 'kicker'),
      element('h2', 'Choose a place'),
      element('p', "Click any country to see its travel notes and photographs. The map highlights places I've visited.")
    );
  }

  function selectCountry(id, name) {
    if (selectedId === id) {
      clearSelection();
      return;
    }
    countryPaths.forEach((path, key) => path.setAttribute('aria-pressed', String(key === id)));
    showCountry(id, name);
  }

  function showCountry(id, name) {
    selectedId = id;
    countryPaths.forEach((path, key) => path.classList.toggle('is-selected', key === id));
    panel.replaceChildren();
    const destination = lookup(id);
    panel.append(element('div', destination ? 'TRIP NOTES' : 'ON THE MAP', 'kicker'));
    const heading = element('h2');
    const flag = flagFor(id);
    if (flag) {
      const icon = element('span', flag, 'country-emoji');
      icon.setAttribute('aria-hidden', 'true');
      heading.append(icon);
    }
    heading.append(document.createTextNode(destination ? destination.name : name));
    panel.append(heading);
    if (destination) {
      panel.append(element('div', destination.region || '', 'country-flag'));
      panel.append(element('p', destination.summary || 'A place in my travel notebook.'));
      const photos = destination.photos || [];
      if (photos.length) {
        const gallery = element('div', '', 'country-gallery country-gallery-compact');
        photos.forEach(photo => {
          const figure = element('figure', '', 'country-photo');
          const open = document.createElement('button');
          open.type = 'button';
          open.className = 'photo-open';
          open.dataset.photoOpen = '';
          open.dataset.photoSrc = photo.src;
          open.dataset.photoAlt = photo.alt || `${destination.name} travel photograph`;
          open.dataset.photoCaption = photo.caption || '';
          open.setAttribute('aria-label', `Open photograph: ${photo.caption || photo.alt || destination.name}`);
          const image = document.createElement('img');
          image.src = photo.src;
          image.alt = '';
          image.loading = 'lazy';
          open.append(image);
          figure.append(open);
          if (photo.caption) figure.append(element('figcaption', photo.caption));
          gallery.append(figure);
        });
        panel.append(gallery);
      }
      const articles = destination.articles || [];
      if (articles.length) articles.forEach(article => {
        const link = document.createElement('a');
        link.className = 'story-link';
        link.href = article.href;
        link.append(document.createTextNode(article.title));
        link.append(element('span', article.date || 'TRIP NOTE'));
        panel.append(link);
      });
      const journalLink = document.createElement('a');
      journalLink.className = 'country-journal-link';
      journalLink.href = `travel-country.html?country=${encodeURIComponent(id)}`;
      journalLink.textContent = 'Open full country journal →';
      panel.append(journalLink);
    } else {
      panel.append(element('p', 'No notes here yet. I can add a country, trip photos and stories to the travel notebook.'));
    }
    const isHome = countryData.homeCountry === id;
    const visited = countryData.visitedCountries.includes(id);
    panel.append(element('div', isHome ? 'HOME · BERLIN' : visited ? 'VISITED' : 'NOT YET DOCUMENTED', 'country-flag'));
  }

  function drawMap() {
    try {
      if (!window.d3 || !window.topojson || !window.worldAtlasData) throw new Error('Map data not available');
      const width = 960;
      const height = 500;
      const world = window.worldAtlasData;
      const collection = topojson.feature(world, world.objects.countries);
      const projection = d3.geoNaturalEarth1().fitExtent([[5, 5], [width - 5, height - 5]], collection);
      const pathGenerator = d3.geoPath(projection);
      map.replaceChildren();
      const group = document.createElementNS(ns, 'g');
      map.append(group);
      collection.features.forEach(country => {
        const id = String(country.id).padStart(3, '0');
        const name = country.properties.name || 'Country';
        const path = document.createElementNS(ns, 'path');
        path.setAttribute('d', pathGenerator(country));
        path.setAttribute('tabindex', '0');
        path.setAttribute('role', 'button');
        const isHome = countryData.homeCountry === id;
        const visited = countryData.visitedCountries.includes(id);
        path.setAttribute('aria-label', `${name}${isHome ? ', home' : visited ? ', visited' : ''}`);
        path.setAttribute('aria-pressed', 'false');
        path.classList.add('country-shape');
        if (countryData.visitedCountries.includes(id)) path.classList.add('is-visited');
        if (isHome) path.classList.add('is-home');
        const title = document.createElementNS(ns, 'title');
        title.textContent = name;
        path.append(title);
        path.addEventListener('click', () => selectCountry(id, name));
        path.addEventListener('keydown', event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            path.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          }
        });
        countryPaths.set(id, path);
        group.append(path);
      });
      const [berlinX, berlinY] = projection([13.405, 52.52]);
      const berlinPin = document.createElementNS(ns, 'g');
      berlinPin.setAttribute('class', 'berlin-pin');
      berlinPin.setAttribute('transform', `translate(${berlinX},${berlinY})`);
      berlinPin.setAttribute('role', 'img');
      berlinPin.setAttribute('aria-label', 'Berlin, Germany');
      const pinShape = document.createElementNS(ns, 'path');
      pinShape.setAttribute('d', 'M0 0C-2-4-12-14-12-21a12 12 0 1 1 24 0C12-14 2-4 0 0Z');
      const pinCenter = document.createElementNS(ns, 'circle');
      pinCenter.setAttribute('cx', '0');
      pinCenter.setAttribute('cy', '-21');
      pinCenter.setAttribute('r', '4');
      const pinLabel = document.createElementNS(ns, 'text');
      pinLabel.setAttribute('x', '15');
      pinLabel.setAttribute('y', '-5');
      pinLabel.setAttribute('class', 'berlin-pin-label');
      pinLabel.textContent = 'Berlin';
      berlinPin.append(pinShape, pinCenter, pinLabel);
      map.append(berlinPin);
      group.addEventListener('click', event => {
        if (event.target === group && selectedId) clearSelection();
      });
      map.addEventListener('click', event => {
        if (event.target === map && selectedId) clearSelection();
      });

      mapSelection = d3.select(map);
      zoomController = d3.zoom()
        .scaleExtent([1, 12])
        .extent([[0, 0], [width, height]])
        .on('zoom', event => {
          group.setAttribute('transform', event.transform);
          const [x, y] = event.transform.apply([berlinX, berlinY]);
          berlinPin.setAttribute('transform', `translate(${x},${y}) scale(${1 / event.transform.k})`);
        });
      mapSelection.call(zoomController).on('dblclick.zoom', null);
      document.querySelectorAll('[data-zoom]').forEach(button => {
        button.addEventListener('click', () => {
          const action = button.getAttribute('data-zoom');
          const transition = mapSelection.transition().duration(window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 180);
          if (action === 'in') transition.call(zoomController.scaleBy, 1.7);
          else if (action === 'out') transition.call(zoomController.scaleBy, 1 / 1.7);
          else transition.call(zoomController.transform, d3.zoomIdentity);
        });
      });
      status.textContent = 'Scroll or use the controls to zoom; drag to move. Visited countries are green; home is copper.';
      if (selectedId) showCountry(selectedId, lookup(selectedId)?.name || '');
    } catch (_) {
      status.textContent = 'The interactive map could not load. The travel notes below are still available.';
    }
  }

  function renderPlaces() {
    places.replaceChildren();
    allDestinations.forEach(destination => {
      const card = element('article', '', 'travel-place');
      card.append(element('div', destination.region || 'TRAVEL NOTE', 'kicker'));
      const heading = element('h3');
      const flag = flagFor(destination.id);
      if (flag) {
        const icon = element('span', flag, 'country-emoji');
        icon.setAttribute('aria-hidden', 'true');
        heading.append(icon);
      }
      heading.append(document.createTextNode(destination.name));
      card.append(heading);
      card.append(element('p', destination.summary || 'A place in my notebook.'));
      const coverPhoto = (destination.photos || [])[0];
      if (coverPhoto) {
        const photoButton = document.createElement('button');
        photoButton.type = 'button';
        photoButton.className = 'photo-open travel-place-photo-open';
        photoButton.dataset.photoOpen = '';
        photoButton.dataset.photoSrc = coverPhoto.src;
        photoButton.dataset.photoAlt = coverPhoto.alt || `${destination.name} travel photograph`;
        photoButton.dataset.photoCaption = coverPhoto.caption || '';
        const image = document.createElement('img');
        image.className = 'travel-place-photo';
        image.src = coverPhoto.src;
        image.alt = coverPhoto.alt || `${destination.name} travel photograph`;
        image.loading = 'lazy';
        photoButton.append(image);
        card.append(photoButton);
      }
      const journalLink = document.createElement('a');
      journalLink.className = 'travel-place-link';
      journalLink.href = `travel-country.html?country=${encodeURIComponent(destination.id)}`;
      journalLink.textContent = 'Open country notes →';
      card.append(journalLink);
      places.append(card);
    });
  }

  renderPlaces();
  drawMap();
})();
