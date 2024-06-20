# Adapted Styles

在這裡放置深色模式的 CSS 或更改主題顏色。

在 `index.ts` 中，我們將編寫一些正規表達式來匹配特定頁面上使用的樣式。

## 樣式表檔案撰寫風格

``` scss
.bewly-design.pageName {
  // 在此處實施對頁面的特定修改，例如調整佈局，並將那些樣式放在這裡。
  .right-side-bar .catalog {
    line-height: 3em;
  }

  // ...

  // #region theme color adaption part
  // 透過在 `:not()` 中寫入一個不存在的選取器來提高內部樣式的優先級。
  :not(foobar) {
    a,
    b,
    c {
      color: var(--bew-theme-color);
    }

    d,
    e,
    f {
      // 請注意，使用 `!important` 應該是最後萬不得已的手段
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

## 何解使用上述之撰寫風格？

您可能會對為什麼應該遵循建議的撰寫風格感到困惑，因此我們在這裡稍作解釋。
由於這並非以該頁面特有的起始样式所撰寫，而且該頁面已經有了原始樣式，您不能僅僅像這樣寫 CSS `xxx {border: 1px solid white; color: black}`。
遵循前面的這種撰寫風格使得維持暗模式風格變得困難。這是因為深色模式主要需要更改字型色彩、背景色彩或框線色彩。

根據字型色彩、背景色彩和框線色彩將顏色進行分組是非常高效的，且透過將相應的選取器放在一起以統一方法便於維護。必要時，只需調整相應樣式中的相應選取器即可。
