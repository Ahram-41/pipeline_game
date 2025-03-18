# Gas Pipeline System

[English](#gas-pipeline-system)| [中文](#燃气管道系统)


A lightweight 2D gas pipeline visualization game built with JavaScript and HTML5 Canvas.

## Features

- Create and visualize a gas pipeline network
- Add gas sources, switches, and connectors
- Connect elements with pipelines
- Control gas flow with switches
- Visualize gas flow through the system with animations
- Drag and drop elements for intuitive layout design
- Right-click to delete elements

## Project Structure

The code has been organized into a clear directory structure:

```
gas-pipeline-system/
├── index.html         # Main HTML file
├── src/               # Source code directory
│   ├── js/            # JavaScript modules
│   │   ├── config.js           # Configuration settings
│   │   ├── i18n.js             # Internationalization support
│   │   ├── elements.js         # Element classes and factory
│   │   ├── renderer.js         # Canvas rendering logic
│   │   ├── simulation.js       # Gas flow simulation
│   │   ├── ui-manager.js       # UI management
│   │   ├── input-handler.js    # Input processing
│   │   └── pipeline.js         # Main application
│   └── css/           # Stylesheet
│       └── styles.css          # CSS styles
└── docs/              # Documentation
    └── TUTORIAL.md              # Learning tutorial
```

## How to Run

### Option 1: Direct File Open
Simply open `index.html` in any modern web browser.

### Option 2: Using Node.js Server (Recommended)
1. Make sure [Node.js](https://nodejs.org/) is installed
2. Open a terminal in the project directory
3. Run `npm start` or `node server.js`
4. Open your browser and navigate to `http://localhost:3000`

## How to Use

Use the toolbar buttons to add elements:
- **Add Gas Source**: Adds a blue rectangular source of gas
- **Add Switch**: Adds a switch that can be toggled on/off to control gas flow
- **Add Connector**: Adds a diamond-shaped connector to join multiple pipelines
- **Add Pipeline**: Activates pipeline mode (click on two elements to connect them)
- **Update Flow**: Recalculates and visualizes the gas flow through the system

## Interactions

- **Left-click**: Select and drag elements, toggle switches, or create pipeline connections
- **Right-click**: Delete elements (and their connected pipelines)
- **Gas Source**: Continuously produces gas (blue rectangle with "G")
- **Switch**: Controls flow (click to toggle ON/OFF)
- **Connector**: Joins multiple pipelines (changes color when gas flows through it)
- **Pipeline**: Connects elements (changes color to green when gas flows through it)

## Implementation Details

- Built with ES6 modules for better code organization
- Object-oriented design with classes and inheritance 
- Separation of concerns (rendering, simulation, UI, input handling)
- Factory pattern for element creation
- Uses HTML5 Canvas for rendering
- Responsive design with modern styling
- Depth-first search algorithm for gas flow propagation
- Animated gas flow visualization

## For New Learners

If you're new to JavaScript and HTML, check out the `docs/TUTORIAL.md` file which provides:
- Detailed explanation of the code structure
- Breakdown of key programming concepts used
- Step-by-step guide to understanding the application
- Learning exercises to improve your skills

## Development

To modify or extend the application:
1. Update configurations in `src/js/config.js` to adjust visual properties
2. Add new elements by extending the base Element class in `src/js/elements.js`
3. Modify the simulation logic in `src/js/simulation.js` as needed


# 燃气管道系统

一个使用 JavaScript 和 HTML5 Canvas 构建的轻量级 2D 燃气管道可视化游戏。

## 功能特点

- 创建和可视化燃气管道网络
- 添加燃气源、开关和连接器
- 使用管道连接各个元件
- 通过开关控制燃气流动
- 通过动画可视化系统中的燃气流动
- 拖放元件实现直观的布局设计
- 右键点击删除元件

## 项目结构

代码已组织成清晰的目录结构：

```
gas-pipeline-system/
├── index.html         # 主 HTML 文件
├── src/               # 源代码目录
│   ├── js/            # JavaScript 模块
│   │   ├── config.js           # 配置设置
│   │   ├── i18n.js             # 国际化支持
│   │   ├── elements.js         # 元素类和工厂
│   │   ├── renderer.js         # Canvas 渲染逻辑
│   │   ├── simulation.js       # 燃气流动模拟
│   │   ├── ui-manager.js       # UI 管理
│   │   ├── input-handler.js    # 输入处理
│   │   └── pipeline.js         # 主应用程序
│   └── css/           # 样式表
│       └── styles.css          # CSS 样式
└── docs/              # 文档
    └── TUTORIAL.md              # 学习教程
```

## 如何运行

### 选项 1：直接文件打开 (修改中，不建议使用)
只需在任何现代网络浏览器中打开 `index.html`。

### 选项 2：使用 Node.js 服务器（推荐）
1. 确保已安装 [Node.js](https://nodejs.org/)
2. 在项目目录中打开终端
3. 运行 `npm start` 或 `node server.js`
4. 在浏览器中打开并导航到 `http://localhost:3000`

## 如何使用

使用工具栏按钮添加元素：
- **添加燃气源**：添加一个蓝色矩形的燃气源
- **添加开关**：添加一个可以切换开/关以控制燃气流动的开关
- **添加连接器**：添加一个菱形连接器以连接多个管道
- **添加管道**：激活管道模式（点击两个元素以连接它们）
- **更新流动**：重新计算并可视化系统中的燃气流动

## 交互

- **左键点击**：选择和拖动元素，切换开关，或创建管道连接
- **右键点击**：删除元素（及其连接的管道）
- **燃气源**：持续产生燃气（带有"G"的蓝色矩形）
- **开关**：控制流动（点击切换开/关）
- **连接器**：连接多个管道（当燃气流过时改变颜色）
- **管道**：连接元素（当燃气流过时变为绿色）

## 实现细节

- 使用 ES6 模块构建以更好地组织代码
- 面向对象设计，使用类和继承
- 关注点分离（渲染、模拟、UI、输入处理）
- 元素创建的工厂模式
- 使用 HTML5 Canvas 进行渲染
- 现代样式的响应式设计
- 深度优先搜索算法用于燃气流动传播
- 动画燃气流动可视化

## 对新学习者

如果你是 JavaScript 和 HTML 的新手，请查看 `docs/TUTORIAL.md` 文件，其中提供：
- 代码结构的详细解释
- 使用的关键编程概念的分解
- 理解应用程序的分步指南
- 提高技能的学习练习

## 开发

要修改或扩展应用程序：
1. 在 `src/js/config.js` 中更新配置以调整视觉属性
2. 通过在 `src/js/elements.js` 中扩展基类 Element 来添加新元素
3. 根据需要修改 `src/js/simulation.js` 中的模拟逻辑