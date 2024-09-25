/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly';
import {blocks} from './blocks/text';
import {htmlBlocks} from './blocks/html';
import {forBlock} from './generators/javascript';
import {javascriptGenerator} from 'blockly/javascript';
import {htmlGenerator} from './generators/html';
import {save, load} from './serialization';
import {toolbox} from './toolbox';
import './index.css';
import DOMPurify from 'dompurify';

// Register the blocks and generator with Blockly
Blockly.common.defineBlocks(htmlBlocks);
Object.assign(javascriptGenerator.forBlock, forBlock);

// Set up UI elements and inject Blockly
const codeDiv = document.getElementById('generatedCode').firstChild;
const outputDiv = document.getElementById('output');
const blocklyDiv = document.getElementById('blocklyDiv');
const ws = Blockly.inject(blocklyDiv, {
  // ワークスペースにおける見た目などの設定
  toolbox, //使用するツールボックスを定義
  grid: {
    spacing: 20,    // グリッド線の間隔
    length: 3,      // グリッド線の長さ
    colour: '#ccc', // グリッド線の色
    snap: true      // グリッドにスナップさせるかどうか
  },
  zoom: {
    controls: true, // ズーム可能かどうか
    wheel: false,   // マウスホイールでズーム可能かどうか
    startScale: 1,  // 初期のズーム倍率
    maxScale: 5,    // 最大ズーム倍率
    minScale: 0.5,  // 最小ズーム倍率
    // scaleSpeed: 1.2, // 1回毎のズーム倍率
  },
  sounds: true, // 音を鳴らすかどうか
});

// This function resets the code and output divs, shows the
// generated code from the workspace, and evals the code.
// In a real application, you probably shouldn't use `eval`.
const runCode = () => {
  const code = htmlGenerator.workspaceToCode(ws);
  codeDiv.innerText = code;

  outputDiv.innerHTML = code;

  // eval(code);

  // 正規表現で <script> タグを取り出す
  const scriptRegex = /<script>([\s\S]*?)<\/script>/;
  const match = code.match(scriptRegex);

  // スクリプト部分とそれ以外の部分を抽出
  const scriptCode = match ? match[1] : '';
  
  // スクリプトを動的に評価
/*
  try {
      eval(DOMPurify.sanitize(scriptCode));
  } catch (e) {
      console.error(e);
  }
*/
  /*
  const outputId = document.getElementById("output");
  const addDiv = document.createElement("div")
  addDiv.textContent =DOMPurify.sanitize(scriptCode);
  outputId.appendChild(addDiv);
  */

  // スクリプトを動的に評価
  // const script = document.createElement('script');
  // script.textContent = scriptCode;
  // document.body.appendChild(script);
};

// Load the initial state from storage and run the code.
load(ws);
runCode();

// Every time the workspace changes state, save the changes to storage.
ws.addChangeListener((e) => {
  // UI events are things like scrolling, zooming, etc.
  // No need to save after one of these.
  if (e.isUiEvent) return;
  save(ws);
});

// Whenever the workspace changes meaningfully, run the code again.
ws.addChangeListener((e) => {
  // Don't run the code when the workspace finishes loading; we're
  // already running it once when the application starts.
  // Don't run the code during drags; we might have invalid state.
  if (
    e.isUiEvent ||
    e.type == Blockly.Events.FINISHED_LOADING ||
    ws.isDragging()
  ) {
    return;
  }
  runCode();
  /*
  function getCodeContent(){
    const getCodeId = document.getElementById("generatedCode");
    const pickCode = getCodeId.querySelector("code");
    const getContentOfCode = pickCode ? pickCode.textContent : getCodeId.textContent;
    return getContentOfCode
  };
  const outputId = document.getElementById("output");
  const addDiv = document.createElement("div")
  addDiv.textContent = getCodeContent();
  outputId.appendChild(addDiv);
  */

  const code = htmlGenerator.workspaceToCode(ws);
  codeDiv.innerText = code;
  outputDiv.innerHTML = code;
  const scriptRegex = /<script>([\s\S]*?)<\/script>/;
  const match = code.match(scriptRegex);
  const scriptCode = match ? match[1] : '';
  const getErrorId = document.getElementById("errorMessage");
  /*
  const addDiv2 = document.createElement("div");
  addDiv2.textContent = scriptCode;
  outputId.appendChild(addDiv2);
  */
  try {
    Function(DOMPurify.sanitize(scriptCode));
    getErrorId.textContent = "何もエラーは起こってません"
    getErrorId.classList = "safe"
  }  catch (e) {
    getErrorId.textContent = e.name + " " +e.message 
    getErrorId.classList = "errorOccured"
  }




});

document.getElementById("button").onclick = () => {
  const getCodeID = document.getElementById("generatedCode");
  const getButtonID = document.getElementById("button");
  getCodeID.classList.toggle("afterClicked");
  getCodeID.classList.toggle("beforeClicked");
  if (getButtonID.textContent === "コードを表示する"){
    getButtonID.textContent = "コードを隠す";
  } else {
    getButtonID.textContent = "コードを表示する";
  }
}

/*
const getButtonId = document.getElementById("button");
if (not (getCodeContent() === "")) {
  const getPageContainerId = doccument.getElementById("pageContainer");
  const addDiv = document.createElement("div");
  addDiv.textContent = getCodeContent();
  getButtonId.appendChild(addDiv);
*/