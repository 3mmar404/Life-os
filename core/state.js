// Singularity - Central State Management
let state = {
    passwords: [],
    contacts: [],
    bookmarks: [],
    settings: { theme: 'nightfall', language: 'ar' },
    isUnlocked: false
};

const listeners = [];

export function getState() {
    return state;
}

export function updateState(newState) {
    state = { ...state, ...newState };
    listeners.forEach(listener => listener());
}

export function subscribe(listener) {
    listeners.push(listener);
    return () => {
        const index = listeners.indexOf(listener);
        if (index > -1) listeners.splice(index, 1);
    };
}
