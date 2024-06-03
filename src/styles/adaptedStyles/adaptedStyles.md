# Adapted Styles

Here, place the CSS for dark mode or change the theme color.

In `index.ts`, we will write some regex rules to match the style used on a specific page.

## Style File Writing Style

``` scss
.bewly-design.pageName {
  // Implement specific modifications to the page, like tweaking the layout, and place those styles here
  .right-side-bar .catalog {
    line-height: 3em;
  }

  // ...

  // #region theme color adaption part
  // Increase the priority of the style inside by writing a non-existent selector in `:not()`
  :not(fdjslfds) {
    a,
    b,
    c {
      color: var(--bew-theme-color);
    }

    d,
    e,
    f {
      // PLEASE NOTE THAT USING `!important` SHOULD BE A LAST RESORT
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

## Why use the above writing style?

You might be confused about why you should follow the suggested writing style, so here we will explain a bit.
Since this isn't written in a pure style specific to the page, and the page already has an original style, you can't simply write CSS like `xxx {border: 1px solid white; color: black}`.
Following this writing style makes it hard to maintain the dark mode style. This is because dark mode primarily requires changes to the text color, background color, or border color.

It's efficient to group colors according to font color, background color, and border color, and to unify the approach by placing the appropriate selectors together for easy maintenance. When necessary, just adjust the corresponding selectors in the corresponding styles.
