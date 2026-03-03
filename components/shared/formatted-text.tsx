'use client';

import React from 'react';

interface FormattedTextProps {
  text: string;
  className?: string;
}

interface ListItem {
  content: string;
  children?: ListItem[];
}

interface TextBlock {
  type: 'paragraph' | 'bullet-list' | 'letter-list';
  items: ListItem[] | string[];
}

function parseText(text: string | undefined): TextBlock[] {
  if (!text) return [];
  const lines = text.split('\n');
  const blocks: TextBlock[] = [];
  let currentBlock: TextBlock | null = null;
  let currentListItems: ListItem[] = [];
  let previousBulletIndent = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    const leadingSpaces = line.length - line.trimStart().length;
    
    // Skip empty lines - they end the current block
    if (!trimmedLine) {
      if (currentBlock && currentBlock.type === 'bullet-list' && currentListItems.length > 0) {
        currentBlock.items = currentListItems;
        blocks.push(currentBlock);
        currentListItems = [];
        previousBulletIndent = 0;
      } else if (currentBlock && currentBlock.type !== 'bullet-list') {
        blocks.push(currentBlock);
      }
      currentBlock = null;
      continue;
    }

    // Check for bullet points (lines starting with - or −)
    const bulletMatch = trimmedLine.match(/^[-−]\s+(.+)/);
    if (bulletMatch) {
      const content = bulletMatch[1].trim();
      // A bullet is nested if it has more indentation than the previous bullet
      const isNested = currentBlock?.type === 'bullet-list' && 
                       currentListItems.length > 0 && 
                       leadingSpaces > previousBulletIndent;
      
      if (currentBlock?.type === 'bullet-list') {
        if (isNested) {
          // Add as nested item to the last top-level item
          const lastItem = currentListItems[currentListItems.length - 1];
          if (!lastItem.children) {
            lastItem.children = [];
          }
          lastItem.children.push({ content });
        } else {
          // Add as top-level item (reset indentation if less indented)
          currentListItems.push({ content });
          previousBulletIndent = leadingSpaces;
        }
      } else {
        // Start new bullet list
        if (currentBlock) blocks.push(currentBlock);
        currentListItems = [{ content }];
        previousBulletIndent = leadingSpaces;
        currentBlock = { type: 'bullet-list', items: [] };
      }
      continue;
    }

    // Check for lettered lists (a), b), c), etc.)
    const letterMatch = trimmedLine.match(/^([a-z])\)\s+(.+)/i);
    if (letterMatch) {
      const content = letterMatch[2].trim();
      if (currentBlock?.type === 'letter-list') {
        (currentBlock.items as string[]).push(content);
      } else {
        if (currentBlock && currentBlock.type === 'bullet-list' && currentListItems.length > 0) {
          currentBlock.items = currentListItems;
          blocks.push(currentBlock);
          currentListItems = [];
        } else if (currentBlock) {
          blocks.push(currentBlock);
        }
        currentBlock = { type: 'letter-list', items: [content] };
      }
      continue;
    }

    // Regular paragraph text
    if (currentBlock?.type === 'bullet-list' && currentListItems.length > 0) {
      // Close the bullet list before starting a paragraph
      currentBlock.items = currentListItems;
      blocks.push(currentBlock);
      currentListItems = [];
      previousBulletIndent = 0;
      currentBlock = { type: 'paragraph', items: [trimmedLine] };
    } else if (currentBlock?.type === 'paragraph') {
      // Append to existing paragraph with a space
      (currentBlock.items as string[])[0] = (currentBlock.items as string[])[0] + ' ' + trimmedLine;
    } else {
      if (currentBlock) blocks.push(currentBlock);
      currentBlock = { type: 'paragraph', items: [trimmedLine] };
    }
  }

  // Don't forget the last block
  if (currentBlock) {
    if (currentBlock.type === 'bullet-list' && currentListItems.length > 0) {
      currentBlock.items = currentListItems;
    }
    blocks.push(currentBlock);
  }

  return blocks;
}

function renderListItem(item: ListItem, index: number): React.ReactNode {
  return (
    <li key={index} className="leading-relaxed">
      {item.content}
      {item.children && item.children.length > 0 && (
        <ul className="list-disc pl-6 mt-2 space-y-1">
          {item.children.map((child, childIndex) => renderListItem(child, childIndex))}
        </ul>
      )}
    </li>
  );
}

export function FormattedText({ text, className = '' }: FormattedTextProps) {
  const blocks = parseText(text);

  return (
    <div className={`space-y-4 ${className}`}>
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'paragraph':
            return (
              <p key={index} className="text-foreground leading-relaxed">
                {block.items[0] as string}
              </p>
            );
          
          case 'bullet-list':
            return (
              <ul key={index} className="list-disc pl-6 space-y-2 text-foreground">
                {(block.items as ListItem[]).map((item, itemIndex) => renderListItem(item, itemIndex))}
              </ul>
            );
          
          case 'letter-list':
            return (
              <ol key={index} className="list-[lower-alpha] pl-6 space-y-2 text-foreground">
                {(block.items as string[]).map((item, itemIndex) => (
                  <li key={itemIndex} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ol>
            );
          
          default:
            return null;
        }
      })}
    </div>
  );
}

