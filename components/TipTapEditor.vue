<template>
  <div class="tiptap-editor">
    <!-- Editor Toolbar -->
    <div class="editor-toolbar" v-if="editor">
      <div class="toolbar-group">
        <button
          @click="editor.chain().focus().toggleBold().run()"
          :class="{ active: editor.isActive('bold') }"
          title="Bold (Ctrl+B)"
          class="toolbar-btn"
        >
          <strong>B</strong>
        </button>
        <button
          @click="editor.chain().focus().toggleItalic().run()"
          :class="{ active: editor.isActive('italic') }"
          title="Italic (Ctrl+I)"
          class="toolbar-btn"
        >
          <em>I</em>
        </button>
        <button
          @click="editor.chain().focus().toggleUnderline().run()"
          :class="{ active: editor.isActive('underline') }"
          title="Underline (Ctrl+U)"
          class="toolbar-btn"
        >
          <u>U</u>
        </button>
        <button
          @click="editor.chain().focus().toggleStrike().run()"
          :class="{ active: editor.isActive('strike') }"
          title="Strikethrough"
          class="toolbar-btn"
        >
          <s>S</s>
        </button>
      </div>

      <div class="toolbar-group">
        <button
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          :class="{ active: editor.isActive('heading', { level: 1 }) }"
          title="Heading 1"
          class="toolbar-btn"
        >
          H1
        </button>
        <button
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="{ active: editor.isActive('heading', { level: 2 }) }"
          title="Heading 2"
          class="toolbar-btn"
        >
          H2
        </button>
        <button
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          :class="{ active: editor.isActive('heading', { level: 3 }) }"
          title="Heading 3"
          class="toolbar-btn"
        >
          H3
        </button>
      </div>

      <div class="toolbar-group">
        <button
          @click="editor.chain().focus().toggleBulletList().run()"
          :class="{ active: editor.isActive('bulletList') }"
          title="Bullet List"
          class="toolbar-btn"
        >
          •
        </button>
        <button
          @click="editor.chain().focus().toggleOrderedList().run()"
          :class="{ active: editor.isActive('orderedList') }"
          title="Ordered List"
          class="toolbar-btn"
        >
          1.
        </button>
        <button
          @click="editor.chain().focus().toggleBlockquote().run()"
          :class="{ active: editor.isActive('blockquote') }"
          title="Quote"
          class="toolbar-btn"
        >
          "
        </button>
      </div>

      <div class="toolbar-group">
        <button
          @click="editor.chain().focus().toggleCodeBlock().run()"
          :class="{ active: editor.isActive('codeBlock') }"
          title="Code Block"
          class="toolbar-btn"
        >
          {'<'}
        </button>
        <button
          @click="editor.chain().focus().toggleCode().run()"
          :class="{ active: editor.isActive('code') }"
          title="Inline Code"
          class="toolbar-btn"
        >
          code
        </button>
      </div>

      <div class="toolbar-group">
        <button
          @click="insertLink()"
          :class="{ active: editor.isActive('link') }"
          title="Insert Link (Ctrl+K)"
          class="toolbar-btn"
        >
          🔗
        </button>
        <button
          @click="insertImage()"
          title="Insert Image"
          class="toolbar-btn"
        >
          🖼️
        </button>
        <button
          @click="insertYoutube()"
          title="Insert YouTube Video"
          class="toolbar-btn"
        >
          ▶️
        </button>
      </div>

      <div class="toolbar-group">
        <button
          @click="editor.chain().focus().undo().run()"
          title="Undo"
          class="toolbar-btn"
        >
          ↶
        </button>
        <button
          @click="editor.chain().focus().redo().run()"
          title="Redo"
          class="toolbar-btn"
        >
          ↷
        </button>
      </div>
    </div>

    <!-- Editor Content -->
    <EditorContent :editor="editor" class="editor-content" />

    <!-- Word Count -->
    <div class="editor-footer">
      <span class="word-count">{{ wordCount }} words</span>
      <span class="char-count">{{ characterCount }} characters</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Youtube from '@tiptap/extension-youtube'
import { computed, watchEffect } from 'vue'

interface Props {
  modelValue: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Start typing...'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      codeBlock: {
        languageClassPrefix: 'language-',
      },
    }),
    Image.configure({
      allowBase64: true,
    }),
    Link.configure({
      openOnClick: false,
      autolink: true,
    }),
    Youtube.configure({
      controls: true,
      nocookie: true,
    }),
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
})

const wordCount = computed(() => {
  if (!editor.value) return 0
  const text = editor.value.getText()
  return text.split(/\s+/).filter(word => word.length > 0).length
})

const characterCount = computed(() => {
  if (!editor.value) return 0
  return editor.value.getText().length
})

// Insert link
const insertLink = () => {
  const url = prompt('Enter URL:')
  if (url) {
    editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }
}

// Insert image
const insertImage = () => {
  const url = prompt('Enter image URL:')
  if (url) {
    editor.value?.chain().focus().setImage({ src: url }).run()
  }
}

// Insert YouTube video
const insertYoutube = () => {
  const url = prompt('Enter YouTube URL or Video ID:')
  if (url) {
    editor.value?.commands.setYoutube({ src: url })
  }
}

// Watch for external changes
watchEffect(() => {
  if (editor.value && props.modelValue !== editor.value.getHTML()) {
    editor.value.commands.setContent(props.modelValue)
  }
})
</script>

<style scoped>
.tiptap-editor {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.editor-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
  background: #f8f9fa;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  align-items: center;
}

.toolbar-group {
  display: flex;
  gap: 4px;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  padding-right: 8px;
}

.toolbar-group:last-child {
  border-right: none;
}

.toolbar-btn {
  padding: 6px 10px;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s;
  color: #333;
}

.toolbar-btn:hover {
  background: #e9ecef;
  border-color: rgba(0, 0, 0, 0.25);
}

.toolbar-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.editor-content {
  flex: 1;
  overflow-y: auto;
  max-height: 500px;
  padding: 16px;
  font-size: 16px;
  line-height: 1.6;
}

/* TipTap Editor Styles */
:deep(.ProseMirror) {
  outline: none;
  word-break: break-word;
  white-space: pre-wrap;
}

:deep(.ProseMirror p) {
  margin-bottom: 1em;
  min-height: 1.5em;
}

:deep(.ProseMirror h1) {
  font-size: 2em;
  font-weight: bold;
  margin: 0.67em 0;
}

:deep(.ProseMirror h2) {
  font-size: 1.5em;
  font-weight: bold;
  margin: 0.75em 0;
}

:deep(.ProseMirror h3) {
  font-size: 1.25em;
  font-weight: bold;
  margin: 0.83em 0;
}

:deep(.ProseMirror ul) {
  list-style: disc;
  padding-left: 1.5em;
  margin-bottom: 1em;
}

:deep(.ProseMirror ol) {
  list-style: decimal;
  padding-left: 1.5em;
  margin-bottom: 1em;
}

:deep(.ProseMirror li) {
  margin-bottom: 0.5em;
}

:deep(.ProseMirror blockquote) {
  border-left: 4px solid #007bff;
  padding-left: 1em;
  color: #666;
  font-style: italic;
  margin-bottom: 1em;
}

:deep(.ProseMirror pre) {
  background: #f5f5f5;
  padding: 1em;
  border-radius: 4px;
  overflow-x: auto;
  margin-bottom: 1em;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.9em;
}

:deep(.ProseMirror code) {
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.9em;
}

:deep(.ProseMirror pre code) {
  background: none;
  padding: 0;
}

:deep(.ProseMirror img) {
  max-width: 100%;
  height: auto;
  margin: 1em 0;
  border-radius: 4px;
}

:deep(.ProseMirror a) {
  color: #007bff;
  text-decoration: underline;
  cursor: pointer;
}

:deep(.ProseMirror a:hover) {
  text-decoration: none;
}

:deep(.ProseMirror hr) {
  border: none;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  margin: 1.5em 0;
}

.editor-footer {
  padding: 12px 16px;
  background: #f8f9fa;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 24px;
  font-size: 14px;
  color: #666;
}

.word-count,
.char-count {
  display: flex;
  gap: 6px;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .tiptap-editor {
    background: #1e1e1e;
    border-color: rgba(255, 255, 255, 0.1);
  }

  .editor-toolbar,
  .editor-footer {
    background: #2d2d2d;
    border-color: rgba(255, 255, 255, 0.1);
  }

  .toolbar-btn {
    background: #3a3a3a;
    border-color: rgba(255, 255, 255, 0.15);
    color: #e0e0e0;
  }

  .toolbar-btn:hover {
    background: #454545;
  }

  .editor-content {
    background: #1e1e1e;
    color: #e0e0e0;
  }

  :deep(.ProseMirror blockquote) {
    color: #999;
  }

  :deep(.ProseMirror pre) {
    background: #2d2d2d;
  }

  :deep(.ProseMirror code) {
    background: #2d2d2d;
  }

  .editor-footer {
    color: #999;
  }
}
</style>
