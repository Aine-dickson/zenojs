export const head = {
    setTitle(title) {
        if (typeof title === 'string') {
            document.title = title;
        }
    },

    setMeta(name, content) {
        if (!name || !content) return;

        let tag = document.querySelector(`meta[name="${name}"]`);
        if (!tag) {
            tag = document.createElement('meta');
            tag.setAttribute('name', name);
            document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
    },

    removeMeta(name) {
        const tag = document.querySelector(`meta[name="${name}"]`);
        if (tag) tag.remove();
    },

    setFavicon(href) {
        let link = document.querySelector('link[rel="icon"]');
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.href = href;
    }
};
