# Adapted Styles

这里放置暗色模式的 CSS 或更改主题颜色。

在 `index.ts` 中，我们将编写一些正则表达式，以匹配特定页面上使用的样式。

## 样式文件编写风格

``` scss
.bewly-design.pageName {
  // 实现对页面的特定修改，例如微调布局，将这些样式放在这里
  .right-side-bar .catalog {
    line-height: 3em;
  }

  // ...

  // #region theme color adaption part
  // 通过在 `:not()` 中编写一个不存在的选择器来增加内部样式的优先级。
  :not(fdjslfds) {
    a,
    b,
    c {
      color: var(--bew-theme-color);
    }

    d,
    e,
    f {
      // 请注意，使用 `!important` 应该是最后万不得已的手段
      color: var(--bew-theme-color) !important;
    }

    g,
    h,
    i {
      background-color: var(--bew-theme-color);
    }

    j,
    k,
    l {
      background-color: var(--bew-theme-color) !important;
    }

    // ...
  }
  // #endregion

  // #region dark mode adaption part
  &.dark {
    aa,
    bb,
    cc {
      color: var(--bew-text-1);
    }

    dd,
    ee,
    ff {
      color: var(--bew-text-1) !important;
    }

    // ...
  }
  // #endregion
}
```

## 为什么要使用上述的编写风格？

也许你会对为什么应该遵循建议的编写风格感到困惑，所以在这里我们将解释一下。
由于这并不是按照页面特定的初始样式编写的，并且页面已经有了原始样式，你不能简单地写入像 `xxx {border: 1px solid white; color: black}` 这样的 CSS。
遵循前面的这种编写风格会使得维护暗模式样式变得困难。这是因为暗色模式主要需要改变文本颜色、背景颜色或边框颜色。

根据字体颜色、背景颜色和边框颜色高效地进行分组，并通过将适当的选择器放在一起统一方法，以便进行轻松维护。在必要时，只需调整相应样式中的相应选择器。
