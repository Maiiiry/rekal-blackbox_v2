# Project Config

**Project:** rekal-blackbox-v2
**Updated:** 2026-06-06

## Project Settings

```yaml
project:
  name: rekal-blackbox-v2
  version: "0.3.0"
```

## Integrations

### SonarQube

```yaml
sonarqube:
  enabled: false
  project_key: rekal-blackbox-v2
```

### Enterprise Plan Audit

```yaml
enterprise_plan_audit:
  enabled: false
```

### MCP Stitch (UI Generation)

```yaml
mcp_stitch:
  enabled: true
  scope: ui_generation
  when: "Setiap kali plan atau task melibatkan pembuatan atau perubahan UI component"
  skill: stitch-design
```

## Preferences

```yaml
preferences:
  auto_commit: false
  verbose_output: false
```

## Special Flows

```yaml
special_flows:
  ui_work:
    required_skill: stitch-design
    trigger: "task menyentuh komponen UI baru atau redesign visual"
```

---
*Config updated: 2026-06-06*
