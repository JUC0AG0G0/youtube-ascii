document.addEventListener("DOMContentLoaded", () => {
    const colorCheckbox = document.getElementById("color");
    const toggleButton = document.getElementById("toggle");

    if (!chrome?.storage?.local) {
        console.error("chrome.storage.local is not available");
        return;
    }

    chrome.storage.local.get("asciiColor", ({ asciiColor }) => {
        colorCheckbox.checked = !!asciiColor;
    });

    colorCheckbox.addEventListener("change", () => {
        chrome.storage.local.set({ asciiColor: colorCheckbox.checked });
    });

    toggleButton.addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: () => {
                    if (!window.__ascii_running) {
                        window.__ascii_running = true;
                        window.__ascii_settings = { useColor: false };

                        chrome.storage.local.get("asciiColor", ({ asciiColor }) => {
                            window.__ascii_settings.useColor = !!asciiColor;
                            updateOpacity();
                        });

                        chrome.storage.onChanged.addListener((changes, area) => {
                            if (area === "local" && changes.asciiColor) {
                                window.__ascii_settings.useColor = changes.asciiColor.newValue;
                                updateOpacity();
                            }
                        });

                        const video = document.querySelector('video');
                        if (!video) return;

                        const player = document.querySelector('ytd-player');
                        const videoContainer = player?.querySelector('.html5-video-container');

                        if (!player || !videoContainer) {
                            console.warn('Impossible de trouver le lecteur vidéo YouTube.');
                            return;
                        }

                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');

                        const asciiContainer = document.createElement('div');
                        asciiContainer.id = 'ascii-container';
                        Object.assign(asciiContainer.style, {
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            width: '100%',
                            height: '100%',
                            zIndex: '10',
                            pointerEvents: 'none',
                            backgroundColor: 'black',
                            overflow: 'hidden',
                            color: 'white',
                        });

                        const overlay = document.createElement('pre');
                        overlay.id = 'ascii-overlay';
                        Object.assign(overlay.style, {
                            margin: '0',
                            padding: '0',
                            fontFamily: 'monospace',
                            whiteSpace: 'pre',
                            width: '100%',
                            height: '100%',
                            userSelect: 'none',
                        });

                        asciiContainer.appendChild(overlay);

                        videoContainer.insertAdjacentElement('afterend', asciiContainer);

                        function updateOpacity() {
                            asciiContainer.style.opacity = window.__ascii_settings.useColor
                                ? "0.6"
                                : "1";
                        }

                        const chars = "@$B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ";
                        const brightnessToChar = [];
                        for (let i = 0; i < 256; i++) {
                            const idx = Math.floor((i / 255) * (chars.length - 1));
                            brightnessToChar[i] = chars[idx];
                        }

                        function convertToASCII(imageData) {
                            const { data, width, height } = imageData;
                            let ascii = "";

                            for (let y = 0; y < height; y++) {
                                for (let x = 0; x < width; x++) {
                                    const i = (y * width + x) * 4;
                                    const r = data[i],
                                        g = data[i + 1],
                                        b = data[i + 2];
                                    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
                                    ascii += brightnessToChar[Math.floor(brightness)];
                                }
                                ascii += "\n";
                            }
                            return ascii;
                        }

                        let previousASCII = "";

                        function render() {
                            if (!window.__ascii_running) return;
                            if (!video || video.readyState < 2) {
                                asciiContainer.style.display = "none";
                                setTimeout(render, 50);
                                return;
                            }

                            asciiContainer.style.display = "block";

                            const rect = video.getBoundingClientRect();
                            const charHeight = 9;
                            const charAspect = 0.6;
                            const cols = Math.floor(rect.width / (charHeight * charAspect));
                            const rows = Math.floor(rect.height / charHeight);

                            canvas.width = cols;
                            canvas.height = rows;

                            ctx.drawImage(video, 0, 0, cols, rows);
                            const frame = ctx.getImageData(0, 0, cols, rows);
                            const ascii = convertToASCII(frame);

                            const fontSize = rect.height / rows;
                            overlay.style.fontSize = `${fontSize}px`;
                            overlay.style.lineHeight = `${fontSize}px`;

                            if (ascii !== previousASCII) {
                                overlay.textContent = ascii;
                                previousASCII = ascii;
                            }

                            setTimeout(render, 15);
                        }

                        render();

                        const mutationObserver = new MutationObserver(() => {
                            const newVideo = document.querySelector("video");
                            if (newVideo !== video) {
                                video = newVideo;
                                if (video) {
                                    asciiContainer.style.display = "block";
                                } else {
                                    asciiContainer.style.display = "none";
                                }
                            }
                        });

                        mutationObserver.observe(document.body, {
                            childList: true,
                            subtree: true,
                        });

                    } else {
                        window.__ascii_running = false;
                        document.getElementById("ascii-container")?.remove();
                    }
                },
            });
        });
    });
});
