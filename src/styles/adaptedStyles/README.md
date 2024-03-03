# Adapted Styles

Here, place the CSS for dark mode or change the theme color.

In `index.ts`, we will write some regex rules to match the style used on specific page.

## Style File Writing Style

``` scss
.bewly-design.pageName {
  // Implement specific modifications to the page, like tweaking the layout, and place those styles here
  .right-side-bar .catalog {
    line-height: 3em;
  }

  ...

  // #region theme color adaption part
  // Increase the priority of the style inside by writing a non-existent selector in :not()
  :not(fdjslfds) {
    a, b, c {
      color: var(--bew-theme-color);
    }

    d, e, f {
      // PLEASE NOTE THAT USING `!important` SHOULD BE A LAST RESORT
      color: var(--bew-theme-color) !important;
    }

    g, h, i {
      background-color: var(--bew-theme-color);
    }

    j, k, l {
      background-color: var(--bew-theme-color) !important;
    }

    ...
  }
  // #endregion

  // #region dark mode adaption part
  &.dark {
    aa, bb, cc {
      color: var(--bew-text-1);
    }

    dd, ee, ff {
      color: var(--bew-text-1) !important;
    }

    ...
  }
  // #endregion
}
```
