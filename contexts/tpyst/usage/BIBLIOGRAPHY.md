## Bibliography (IEEE style recommended)

A **Hayagriva file is a top-level YAML** mapping: each entry starts with a unique citation key (your choice, like smith2023), followed by indented fields.

**Key fields**:

- **type**: The entry type (e.g., article, book, web, thesis, chapter, video, misc — case-insensitive).
- **title**: The main title (string).
- **author**: One or more authors (simple strings like "Last, First" or a list).
- **date**: Publication date (ISO format, e.g., 2023, 2023-06, or 2023-06-21).
- **parent**: Optional nested mapping for the container (e.g., journal for an article).
- **Other common**: volume, issue, page-range, publisher, url, doi (under serial-number), etc.

**Simple Examples**

Save this as `references.yml`:

```yaml
smith2023:
  type: article
  title: Advances in TinyML for Edge Devices
  author:
    - Smith, John
    - Doe, Jane
  date: 2023
  parent:
    type: periodical
    title: IEEE Internet of Things Journal
    volume: 10
    issue: 5
    publisher: IEEE

rowling2003:
  type: book
  title: Harry Potter and the Order of the Phoenix
  author: Rowling, J. K.
  date: 2003-06-21
  volume: 5
  page-total: 768
  publisher: Bloomsbury

edgeimpulse2024:
  type: web
  title: Edge Impulse Documentation - TinyML Deployment
  author: Edge Impulse Team
  date: 2024
  url: https://docs.edgeimpulse.com/docs
```

**More Options**

- Authors as simple list: author: `["Smith, John", "Doe, Jane"]`
- DOI: `serial-number: { doi: "10.1109/JIOT.2023.123456" }`
- For a thesis: `type: thesis`, add `genre: Master Dissertation, organization: <Your University>`

**Using in Typst**

In your `.typ` file:

```typst
#bibliography("references.yml", style: "ieee")  // or "apa", "chicago-author-date", etc.
```

Cite in text with @smith2023 → renders as [1] or (Smith et al., 2023) depending on style.

For more details, see the [Yaml Hayagriva documentation](https://github.com/typst/hayagriva/blob/main/docs/file-format.md?referrer=grok.com).