// assets/js/blog.js

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  if (path.endsWith("/blog/index.html") || path.endsWith("/blog/")) {
    loadBlogList();
  }

  if (path.endsWith("/blog/post.html")) {
    loadBlogPost();
  }
});

function loadBlogList() {
  const listEl = document.getElementById("blog-list");
  if (!listEl) return;

  fetch("/blog/posts_ru.json")
    .then((res) => res.json())
    .then((posts) => {
      posts.forEach((post) => {
        const card = document.createElement("article");
        card.className = "blog-card";
        card.innerHTML = `
          <img src="${post.cover_image}" alt="${post.title}">
          <div class="blog-card-body">
            <div class="blog-card-meta">
              <span>${post.date}</span> · <span>${post.reading_time}</span>
            </div>
            <h2 class="blog-card-title">${post.title}</h2>
            <p class="blog-card-excerpt">${post.excerpt}</p>
            <div class="blog-card-tags">
              ${(post.tags || [])
                .map((t) => `<span class="blog-tag">${t}</span>`)
                .join("")}
            </div>
          </div>
        `;
        card.addEventListener("click", () => {
          window.location.href = `/blog/post.html?slug=${encodeURIComponent(
            post.slug
          )}`;
        });
        listEl.appendChild(card);
      });
    })
    .catch((err) => console.error("Error loading blog list:", err));
}

function loadBlogPost() {
  const container = document.getElementById("post-container");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  if (!slug) return;

  fetch(`/blog/ru/${slug}.json`)
    .then((res) => res.json())
    .then((post) => {
      renderPost(container, post);
      setupShareButtons(post);
    })
    .catch((err) => console.error("Error loading post:", err));
}

function renderPost(container, post) {
  const cover = post.cover_image
    ? `<img src="${post.cover_image}" alt="${post.title}" class="cover" />`
    : "";

  const meta = `<div class="meta">${post.date} · ${post.reading_time}</div>`;

  const sectionsHtml = (post.sections || [])
    .map((sec) => {
      if (sec.type === "h2") return `<h2>${sec.text}</h2>`;
      if (sec.type === "p") return `<p>${sec.text}</p>`;
      return "";
    })
    .join("");

  const ctaHtml = post.cta
    ? `
      <section>
        <p>${post.cta.text}</p>
        <a href="${post.cta.button_url}" class="btn btn-primary">
          ${post.cta.button_text}
        </a>
      </section>
    `
    : "";

  container.innerHTML = `
    <h1>${post.title}</h1>
    ${meta}
    ${cover}
    ${sectionsHtml}
    ${ctaHtml}
  `;
}

function setupShareButtons(post) {
  const url = window.location.href;
  const text = post.title;

  const tg = document.getElementById("share-tg");
  const wa = document.getElementById("share-wa");
  const x = document.getElementById("share-x");
  const li = document.getElementById("share-li");

  if (tg)
    tg.href = `https://t.me/share/url?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(text)}`;
  if (wa)
    wa.href = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
  if (x)
    x.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(url)}`;
  if (li)
    li.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}`;
}
