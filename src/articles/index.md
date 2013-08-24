---
title: Articles
---

{{#withSort pages "data.date"}}
    {{#if data.date}}
* [{{data.title}}]({{pagename}}) {{data.date}}
    {{/if}}
{{/withSort}}
