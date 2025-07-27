;; Chat language markdown injection queries
;; Injects markdown highlighting into content sections

((content) @injection.content
 (#set! injection.language "markdown")
 (#set! injection.include-children))
