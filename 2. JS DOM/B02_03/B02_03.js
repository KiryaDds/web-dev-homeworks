const TextEditor = {
    selectedSentence: null,
    editor: null,
    contextMenu: null,
    editDialog: null,
    editInput: null,

    init() {
        this.editor = document.getElementById('editor');
        this.contextMenu = document.getElementById('contextMenu');
        this.editDialog = document.getElementById('editDialog');
        this.editInput = document.getElementById('editInput');

        document.addEventListener('click', this.handleDocumentClick.bind(this));
        document.addEventListener('keydown', this.handleKeydown.bind(this));

        this.addParagraph();
    },

    handleKeydown(e) {
        if (e.key === 'Escape') {
            this.hideContextMenu();
            this.closeEditDialog();
            if (this.selectedSentence) {
                this.selectedSentence.classList.remove('selected');
                this.selectedSentence = null;
            }
        }
    },

    handleDocumentClick(e) {
        if (!this.contextMenu.contains(e.target) && !this.editDialog.contains(e.target)) {
            this.hideContextMenu();
            this.closeEditDialog();
            if (!e.target.closest('span')) {
                if (this.selectedSentence) {
                    this.selectedSentence.classList.remove('selected');
                    this.selectedSentence = null;
                }
            }
        }
    },

    addParagraph() {
        const p = document.createElement('p');
        const span = document.createElement('span');
        span.textContent = 'New sentence';
        p.appendChild(span);
        this.editor.appendChild(p);
        this.setupSentenceListeners(span);
    },

    addSentence() {
        const span = document.createElement('span');
        span.textContent = 'New sentence';
        this.setupSentenceListeners(span);

        if (this.selectedSentence) {
            this.selectedSentence.parentNode.insertBefore(span, this.selectedSentence);
        } else {
            const lastParagraph = this.editor.lastElementChild;
            if (lastParagraph) {
                lastParagraph.appendChild(span);
            } else {
                this.addParagraph();
            }
        }
        this.hideContextMenu();
    },

    setupSentenceListeners(span) {
        span.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.selectedSentence === span) {
                span.classList.remove('selected');
                this.selectedSentence = null;
            } else {
                if (this.selectedSentence) {
                    this.selectedSentence.classList.remove('selected');
                }
                span.classList.add('selected');
                this.selectedSentence = span;
            }
        });

        span.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (this.selectedSentence) {
                this.selectedSentence.classList.remove('selected');
            }
            span.classList.add('selected');
            this.selectedSentence = span;
            this.showContextMenu(e.pageX, e.pageY);
        });
    },

    showContextMenu(x, y) {
        this.contextMenu.style.display = 'block';
        // Ensure menu stays within viewport
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const menuWidth = this.contextMenu.offsetWidth;
        const menuHeight = this.contextMenu.offsetHeight;

        if (x + menuWidth > viewportWidth) {
            x = viewportWidth - menuWidth - 5;
        }
        if (y + menuHeight > viewportHeight) {
            y = viewportHeight - menuHeight - 5;
        }

        this.contextMenu.style.left = Math.max(0, x) + 'px';
        this.contextMenu.style.top = Math.max(0, y) + 'px';
    },

    showEditDialog() {
        if (this.selectedSentence) {
            this.editDialog.style.display = 'block';
            const rect = this.selectedSentence.getBoundingClientRect();
            
            // Position dialog below the sentence
            let left = rect.left;
            let top = rect.bottom + 5;

            // Ensure dialog stays within viewport
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const dialogWidth = this.editDialog.offsetWidth;
            const dialogHeight = this.editDialog.offsetHeight;

            if (left + dialogWidth > viewportWidth) {
                left = viewportWidth - dialogWidth - 5;
            }
            if (top + dialogHeight > viewportHeight) {
                top = rect.top - dialogHeight - 5;
            }

            this.editDialog.style.left = Math.max(0, left) + 'px';
            this.editDialog.style.top = Math.max(0, top) + 'px';
            
            this.editInput.value = this.selectedSentence.textContent;
            this.editInput.focus();
        }
        this.hideContextMenu();
    },

    closeEditDialog() {
        this.editDialog.style.display = 'none';
    },

    updateSelectedSentence() {
        if (this.selectedSentence && this.editInput.value.trim()) {
            this.selectedSentence.textContent = this.editInput.value;
            this.closeEditDialog();
        }
    },

    deleteSelectedSentence() {
        if (this.selectedSentence) {
            const paragraph = this.selectedSentence.parentNode;
            this.selectedSentence.remove();
            if (paragraph.children.length === 0) {
                paragraph.remove();
            }
            this.selectedSentence = null;
        }
        this.hideContextMenu();
    },

    deleteSelectedParagraph() {
        if (this.selectedSentence) {
            this.selectedSentence.parentNode.remove();
            this.selectedSentence = null;
        }
        this.hideContextMenu();
    },

    hideContextMenu() {
        this.contextMenu.style.display = 'none';
    }
};

// Initialize the editor when the page loads
document.addEventListener('DOMContentLoaded', () => TextEditor.init());
