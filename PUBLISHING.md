# Publishing articles and travel notes

This is a static site: there is no admin panel or database. Write articles as HTML, add their details to a small JavaScript file, and keep photographs in `content/photos/`. Changes stay local until you commit and push them. Once the repository is connected to GitHub Pages, pushing to its publishing branch updates the live site.

## Publish a Writing article

1. Copy `writing/posts/_template.html` to a new file. Use a short, lowercase filename with hyphens, for example `writing/posts/a-week-in-tokyo.html`.
2. Edit the new HTML file: set the page title, description, heading, date/topic, and article text. Add headings with `<h2>`, paragraphs with `<p>`, and photographs with `<img>`.
3. Put article photographs in `content/photos/`. From a Writing article, image paths start with `../../content/photos/`, for example:

   ```html
   <img class="article-photo" src="../../content/photos/tokyo-night.jpg" alt="Lanterns along a Tokyo side street">
   ```

4. Add the article to `window.alexArticles` in `content/articles.js`. The `href` starts at the site root:

   ```js
   { title: 'A week in Tokyo', date: '2026-10-01', summary: 'A few days of walking, trains and small discoveries.', href: 'writing/posts/a-week-in-tokyo.html' }
   ```

   Use `YYYY-MM-DD` for dates. The Writing page sorts articles newest first.

## Update the Travel journal

The notebook section automatically shows one card for every country in `visitedCountries`, plus Germany as home. Every card opens its own country journal, for example `travel-country.html?country=840`; these country pages share one template and read their content from `content/travel.js`. You only need to add a `destinations` entry when you have details to show; unedited countries still appear as ready-to-fill cards. Use each country's `region` field for its cities or places, separated by `·`, such as `Tokyo · Kyoto`.

1. Copy your photographs into `content/photos/`. Use descriptive names and write useful `alt` text for each image.
2. Find the country's three-digit ISO 3166-1 numeric code. Add it to `visitedCountries` in `content/travel.js`; visited countries are green on the map. Germany is the home country (`homeCountry: '276'`) and is shown in copper. Leave that setting in place.
3. Add or update that country in `destinations`. Its `id` must match the numeric code. Add a short summary, region or city, and the photo paths:

   ```js
   {
     id: '392',
     name: 'Japan',
     region: 'Tokyo · Kyoto',
     summary: 'A short introduction to the trip.',
     photos: [
       { src: 'content/photos/kyoto-evening.jpg', alt: 'Lanterns along a Kyoto side street', caption: 'A quiet evening in Kyoto' },
       { src: 'content/photos/tokyo-station.jpg', alt: 'Travellers crossing Tokyo Station' }
     ],
     articles: []
   }
   ```

   The image path is relative to the site root, even though the file lives in `content/photos/`. Add as many objects to `photos` as you need. Each can have an `alt` description and an optional `caption`; photos open large when clicked. Every photo appears in the country's full-page journal, and the first is also used as the notebook card cover.
4. To write a longer trip story, copy `travel/entries/_template.html` to a descriptive path such as `travel/entries/japan.html`. Replace the title, date, introduction, text and photo placeholder. Use `../../content/photos/filename.jpg` for images in a travel entry.
5. Link the story in the country's `articles` array so it appears when that country is selected on the map:

   ```js
   articles: [
     { title: 'A week in Japan', date: '2026-10-01', href: 'travel/entries/japan.html' }
   ]
   ```

   Countries can have multiple photos and multiple articles. The map supports zoom buttons, trackpad/mouse-wheel zoom, and dragging to pan. The pin marks Berlin.

## Preview and publish

Open `index.html` to preview the site locally. On the Travel page, check the map and select the country you updated. Check article links and photo paths before publishing.

When you're ready to publish, commit and push the files you changed. For example:

```sh
git add content/articles.js writing/posts/a-week-in-tokyo.html
git commit -m "Add Tokyo travel article"
git push
```

Use the corresponding travel files in place of the example Writing paths. Do not include photographs or drafts that you do not want public.

## Profile photographs

- Add Alexander's portrait to `content/photos/` and replace the placeholder in `about.html` with an `<img>` using that path and descriptive `alt` text.
- Add a Toffee photograph to `content/photos/` and replace the photo placeholder in `index.html` the same way.

## Contact and social profiles

Instagram, LinkedIn and the public email address are listed in `assets/js/site.js`. Update those links there; the footer and Contact page contain their own clickable versions, so update both locations when a URL changes.
