# Adapted Styles

喺呢度會擺啲深色模式同埋變更佈景色嘅 CSS

喺 `index.ts`，我哋會寫一啲正則表達式令到寫嘅樣式夾返特定嘅頁面。

## 樣式檔書寫風格

``` scss
.bewly-design.pageName {
  // 喺當前嘅頁面進行特別嘅修改，就好似你係噉以執吓個佈局，將嗰啲嘢擺晒落呢度
  .right-side-bar .catalog {
    line-height: 3em;
  }

  // ...

  // #region theme color adaption part
  // 用 `:not()` 選取選取唔存在嘅元素愛嚟提高喺呢度入邊嘅優先權
  :not(fdjslfds) {
    a,
    b,
    c {
      color: var(--bew-theme-color);
    }

    d,
    e,
    f {
      // 請注意用 `!important` 係你最後嘅選擇
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

## 點解要用上高嘅書寫風格？

你可能唔係幾明點解要跟住建議嘅書寫風格，所以而家我哋慢慢解釋。
事關你唔係用呢個網頁最初嘅樣式嚟寫，而呢個網頁不溜就已經有咗自己嘅樣式，所以你唔可以直接噉寫 CSS 就好似 `xxx {border: 1px solid white; color: black}` 噉。
學似啱啱嘅書寫風格後續會勁難維護深色模式。因為深色模式主要係改文本顏色、背景顏色或者邊框顏色呢啲嚟達到效果。

將啲顏色按照字體顏色、背景顏色同埋邊框顏色噉樣分類，再將適合嘅選取器擺埋一齊，用統一嘅處理手法嚟管理，噉樣做會提高效率同埋易啲維護。之後需要執吓佢嗰陣，淨係需要就住相對應嘅樣式風格嚟調整返相對應嘅選取器就得嘞。
