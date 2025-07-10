// Reusable renderer function
// type {target: HTMLElement, renderOptions: string[], conditions: (boolean | function)[], events: object}
// events: {'selector': {eventType: string, handler: function}}
const renderer = ({
    target,
    renderOptions = [],
    conditions = [],
    events = {},
}) => {
    if (!target || !renderOptions.length) return console.warn('renderer: Target or renderOptions missing');
    if (!(target instanceof HTMLElement)) {
        console.warn('renderer: Invalid target', target);
        return;
    }

    console.log(target)
    const container = document.createElement('div');

    const maxIndex = Math.min(conditions.length, renderOptions.length - 1);

    let selectedIndex = -1;
    for (let i = 0; i < maxIndex; i++) {
        const condition = typeof conditions[i] === 'function' ? conditions[i]() : conditions[i];
        if (condition) {
            selectedIndex = i;
            break;
        }
    }

    // Fallback to "else" branch if none matched
    if (selectedIndex === -1) {
        if (conditions.length === 0) {
            selectedIndex = 0; // render the first option when no conditions are provided
        } else if (renderOptions.length === 1) {
            selectedIndex = conditions[0] ? 0 : -1;
        } else {
            selectedIndex = renderOptions.length - 1;
        }
    }

    if (selectedIndex !== -1) {
        container.innerHTML = renderOptions[selectedIndex];
        target.replaceChildren(...container.childNodes);
    } else {
        // If single renderOption with condition that failed, clear target
        target.replaceChildren();
    }

    // Attach event listeners
    Object.entries(events).forEach(([selector, { eventType = 'click', handler }]) => {
        const elements = target.querySelectorAll(selector);
        elements.forEach(el => el.addEventListener(eventType, handler));
    });

    return selectedIndex;
};

export default renderer;