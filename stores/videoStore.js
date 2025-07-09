import { defineStore } from '../store.js';
import { ref, reactive } from '../reaxis.js';
import { useAuthStore } from './appStore.js';

export const useVideoStore = defineStore('videos', () => {
    const selectedFiles = ref([]);
    const currentStep = ref(1);
    const videos = ref([]);
    const uploadProgress = reactive({
        overall: 0,
        files: []
    });

    const selectFiles = (files) => {
        selectedFiles.value = files;
    };

    const uploadVideos = async () => {
        if (selectedFiles.value.length === 0) {
            console.warn('No files selected for upload');
            return;
        }

        selectedFiles.value.forEach((file, i) => {
            addVideo(file);

        });
    }
    const addVideo = (video) => {
        const newVideo = {
            id: Date.now() + Math.random(), // Ensure unique ID
            ...video,
            uploadDate: new Date().toISOString(),
            views: 0,
            duration: Math.floor(Math.random() * 600) + 60, // Random duration between 1-10 minutes
            size: video.size || 0,
            url: video.url || '#'
        };
        videos.value.push(newVideo);
        return newVideo;
    };

    const deleteVideo = (id) => {
        const index = videos.value.findIndex(v => v.id === id);
        if (index > -1) {
            videos.value.splice(index, 1);
            return true;
        }
        return false;
    };

    const updateVideo = (id, updates) => {
        const video = videos.value.find(v => v.id === id);
        if (video) {
            Object.assign(video, updates);
            return video;
        }
        return null;
    };

    const incrementViews = (id) => {
        const video = videos.value.find(v => v.id === id);
        if (video) {
            video.views++;
            return video;
        }
        return null;
    };

    const getVideosByCategory = (category) => {
        return videos.value.filter(v => v.category === category);
    };

    const getVideosBySubject = (subject) => {
        return videos.value.filter(v => v.subject === subject);
    };

    const searchVideos = (query) => {
        const lowercaseQuery = query.toLowerCase();
        return videos.value.filter(v => 
            v.title.toLowerCase().includes(lowercaseQuery) ||
            v.category.toLowerCase().includes(lowercaseQuery) ||
            v.subject.toLowerCase().includes(lowercaseQuery)
        );
    };

    return {
        videos, currentStep, uploadProgress,
        addVideo, deleteVideo, updateVideo,
        incrementViews, getVideosByCategory,
        getVideosBySubject, searchVideos,
        selectFiles, selectedFiles, uploadVideos
    };
}, { persist: true });