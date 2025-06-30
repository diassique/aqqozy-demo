'use client';

import { useState, useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $getSelection, $isRangeSelection, EditorState } from 'lexical';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { $createHeadingNode, $createQuoteNode, HeadingNode, QuoteNode } from '@lexical/rich-text';
import { $createListNode, $createListItemNode, ListNode, ListItemNode } from '@lexical/list';
import { $createLinkNode, LinkNode } from '@lexical/link';
import { $isAtNodeEnd } from '@lexical/selection';
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import { FORMAT_TEXT_COMMAND, FORMAT_ELEMENT_COMMAND, INDENT_CONTENT_COMMAND, OUTDENT_CONTENT_COMMAND, UNDO_COMMAND, REDO_COMMAND } from 'lexical';
import { Bold, Italic, Underline, List, ListOrdered, Quote, Link, Undo, Redo } from 'lucide-react';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';

const theme = {
  ltr: 'ltr',
  rtl: 'rtl',
  placeholder: 'editor-placeholder',
  paragraph: 'editor-paragraph',
  quote: 'editor-quote',
  heading: {
    h1: 'editor-heading1',
    h2: 'editor-heading2',
    h3: 'editor-heading3',
    h4: 'editor-heading4',
    h5: 'editor-heading5',
  },
  list: {
    nested: {
      listitem: 'editor-nested-listitem',
    },
    ol: 'editor-list-ol',
    ul: 'editor-list-ul',
    listitem: 'editor-listitem',
  },
  image: 'editor-image',
  link: 'editor-link',
  text: {
    bold: 'editor-text-bold',
    italic: 'editor-text-italic',
    overflowed: 'editor-text-overflowed',
    hashtag: 'editor-text-hashtag',
    underline: 'editor-text-underline',
    strikethrough: 'editor-text-strikethrough',
    underlineStrikethrough: 'editor-text-underlineStrikethrough',
    code: 'editor-text-code',
  },
  code: 'editor-code',
  codeHighlight: {
    atrule: 'editor-tokenAttr',
    attr: 'editor-tokenAttr',
    boolean: 'editor-tokenProperty',
    builtin: 'editor-tokenSelector',
    cdata: 'editor-tokenComment',
    char: 'editor-tokenSelector',
    class: 'editor-tokenFunction',
    'class-name': 'editor-tokenFunction',
    comment: 'editor-tokenComment',
    constant: 'editor-tokenProperty',
    deleted: 'editor-tokenProperty',
    doctype: 'editor-tokenComment',
    entity: 'editor-tokenOperator',
    function: 'editor-tokenFunction',
    important: 'editor-tokenVariable',
    inserted: 'editor-tokenSelector',
    keyword: 'editor-tokenAttr',
    namespace: 'editor-tokenVariable',
    number: 'editor-tokenProperty',
    operator: 'editor-tokenOperator',
    prolog: 'editor-tokenComment',
    property: 'editor-tokenProperty',
    punctuation: 'editor-tokenPunctuation',
    regex: 'editor-tokenVariable',
    selector: 'editor-tokenSelector',
    string: 'editor-tokenSelector',
    symbol: 'editor-tokenProperty',
    tag: 'editor-tokenProperty',
    url: 'editor-tokenOperator',
    variable: 'editor-tokenVariable',
  },
};

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
  console.error(error);
}

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const updateToolbar = () => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
    }
  };

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      })
    );
  }, [editor]);

  const formatBold = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  };

  const formatItalic = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
  };

  const formatUnderline = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
  };

  const formatBulletList = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const listNode = $createListNode('bullet');
        const listItemNode = $createListItemNode();
        listNode.append(listItemNode);
        selection.insertNodes([listNode]);
      }
    });
  };

  const formatNumberedList = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const listNode = $createListNode('number');
        const listItemNode = $createListItemNode();
        listNode.append(listItemNode);
        selection.insertNodes([listNode]);
      }
    });
  };

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const quoteNode = $createQuoteNode();
        selection.insertNodes([quoteNode]);
      }
    });
  };

  const undo = () => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
  };

  const redo = () => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
  };

  return (
    <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
      <button
        type="button"
        onClick={undo}
        className="p-2 hover:bg-gray-200 rounded"
        title="Отменить"
      >
        <Undo size={16} />
      </button>
      <button
        type="button"
        onClick={redo}
        className="p-2 hover:bg-gray-200 rounded"
        title="Повторить"
      >
        <Redo size={16} />
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1" />
      <button
        type="button"
        onClick={formatBold}
        className={`p-2 hover:bg-gray-200 rounded ${isBold ? 'bg-gray-300' : ''}`}
        title="Жирный"
      >
        <Bold size={16} />
      </button>
      <button
        type="button"
        onClick={formatItalic}
        className={`p-2 hover:bg-gray-200 rounded ${isItalic ? 'bg-gray-300' : ''}`}
        title="Курсив"
      >
        <Italic size={16} />
      </button>
      <button
        type="button"
        onClick={formatUnderline}
        className={`p-2 hover:bg-gray-200 rounded ${isUnderline ? 'bg-gray-300' : ''}`}
        title="Подчеркнутый"
      >
        <Underline size={16} />
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1" />
      <button
        type="button"
        onClick={formatBulletList}
        className="p-2 hover:bg-gray-200 rounded"
        title="Маркированный список"
      >
        <List size={16} />
      </button>
      <button
        type="button"
        onClick={formatNumberedList}
        className="p-2 hover:bg-gray-200 rounded"
        title="Нумерованный список"
      >
        <ListOrdered size={16} />
      </button>
      <button
        type="button"
        onClick={formatQuote}
        className="p-2 hover:bg-gray-200 rounded"
        title="Цитата"
      >
        <Quote size={16} />
      </button>
    </div>
  );
}

function InitialValuePlugin({ value }: { value: string }) {
  const [editor] = useLexicalComposerContext();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (value && !isInitialized) {
      editor.update(() => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(value, 'text/html');
        const nodes = $generateNodesFromDOM(editor, dom);
        const root = $getRoot();
        root.clear();
        root.append(...nodes);
      });
      setIsInitialized(true);
    }
  }, [editor, value, isInitialized]);

  return null;
}

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function Placeholder({ placeholder }: { placeholder: string }) {
  return (
    <div className="editor-placeholder absolute top-4 left-4 text-gray-400 pointer-events-none select-none">
      {placeholder}
    </div>
  );
}

export default function RichTextEditor({ value, onChange, placeholder = "Введите описание..." }: RichTextEditorProps) {
  const initialConfig = {
    namespace: 'RichTextEditor',
    theme,
    onError,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      LinkNode,
    ],
    editorState: null,
  };

  const handleChange = (editorState: EditorState, editor: any) => {
    editorState.read(() => {
      const htmlString = $generateHtmlFromNodes(editor, null);
      onChange(htmlString);
    });
  };

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden bg-white">
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="min-h-[200px] p-4 outline-none resize-none overflow-auto leading-normal"
                style={{
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  lineHeight: '1.5'
                }}
              />
            }
            placeholder={<Placeholder placeholder={placeholder} />}
            ErrorBoundary={({ children }) => <div>{children}</div>}
          />
          <OnChangePlugin onChange={handleChange} />
          <InitialValuePlugin value={value} />
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
        </div>
      </LexicalComposer>
      <style jsx global>{`
        .editor-paragraph {
          margin: 0 0 8px 0;
          position: relative;
          line-height: 1.5;
        }
        .editor-paragraph:last-child {
          margin-bottom: 0;
        }
        .editor-quote {
          margin: 0 0 10px 20px;
          padding-left: 16px;
          border-left: 4px solid #ccc;
          font-style: italic;
          line-height: 1.5;
        }
        .editor-heading1 {
          font-size: 24px;
          color: rgb(5, 5, 5);
          font-weight: 400;
          margin: 0 0 12px 0;
          padding: 0;
          line-height: 1.3;
        }
        .editor-heading2 {
          font-size: 20px;
          color: rgb(101, 103, 107);
          font-weight: 700;
          margin: 10px 0 8px 0;
          padding: 0;
          text-transform: uppercase;
          line-height: 1.3;
        }
        .editor-heading3 {
          font-size: 18px;
          color: rgb(101, 103, 107);
          font-weight: 700;
          margin: 10px 0 8px 0;
          padding: 0;
          text-transform: uppercase;
          line-height: 1.3;
        }
        .editor-list-ol {
          padding: 0;
          margin: 0 0 8px 0;
          padding-left: 24px;
          line-height: 1.5;
          list-style-type: decimal;
        }
        .editor-list-ul {
          padding: 0;
          margin: 0 0 8px 0;
          padding-left: 24px;
          line-height: 1.5;
          list-style-type: disc;
        }
        .editor-listitem {
          margin: 2px 0;
          line-height: 1.5;
          display: list-item;
        }
        .editor-nested-listitem {
          list-style-type: none;
        }
        .editor-text-bold {
          font-weight: bold;
        }
        .editor-text-italic {
          font-style: italic;
        }
        .editor-text-underline {
          text-decoration: underline;
        }
        .editor-link {
          color: rgb(33, 111, 219);
          text-decoration: none;
        }
        .editor-link:hover {
          text-decoration: underline;
        }
        .editor-placeholder {
          opacity: 0.6;
          user-select: none;
        }
      `}</style>
    </div>
  );
} 