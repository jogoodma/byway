ruleset byway.root {
  meta {
    name "Byway Root"
    description "Base rulesets for managing ."
    use module io.picolabs.wrangler alias wrangler
    shares bywayChildren
  }
  global {
    bywayChildren = function() {
      wrangler:children()
    }
  }
}
