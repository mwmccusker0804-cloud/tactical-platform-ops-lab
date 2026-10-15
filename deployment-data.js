window.tpolDeployment = {
  "nodes": [
    {
      "id": "mission",
      "title": "mission-api",
      "zone": "UDS / Kubernetes",
      "state": "Previously verified",
      "job": "Your podinfo training workload exposes /metrics and serves an HTTP page.",
      "analogy": "The service you are responsible for keeping available.",
      "evidence": "Ready pods plus a successful request through tpol-training.uds.dev; metrics alone do not prove ingress.",
      "command": "uds zarf tools kubectl --context k3d-uds -n tpol-training get pods,svc",
      "next": "Refresh Live UDS Lab for current evidence."
    },
    {
      "id": "forward",
      "title": "Pod port-forward",
      "zone": "Ubuntu / WSL2",
      "state": "Previously verified",
      "job": "Makes one pod port reachable at Ubuntu localhost:9898. It bypasses the Service/ingress route.",
      "analogy": "A temporary maintenance cable directly to one unit.",
      "evidence": "The forwarding terminal remains running and /metrics responds.",
      "command": "ss -ltnp",
      "next": "Restart your monitoring helper if the selected pod is replaced."
    },
    {
      "id": "nativeprom",
      "title": "Native Prometheus",
      "zone": "Ubuntu / WSL2",
      "state": "Previously verified",
      "job": "Scrapes mission-api numbers from localhost:9898 and stores time series on disk.",
      "analogy": "A clerk recording instrument readings at intervals.",
      "evidence": "A fresh UP target and a recent query result for job=\"mission-api\".",
      "command": "curl -fsS http://127.0.0.1:9090/-/ready",
      "next": "Use the Monitoring tab; this readiness check alone does not verify scraping."
    },
    {
      "id": "nativegraf",
      "title": "Native Grafana",
      "zone": "Ubuntu / WSL2",
      "state": "Previously verified",
      "job": "Queries your existing Prometheus and plots its measurements.",
      "analogy": "The instrument panel, not the instrument itself.",
      "evidence": "A new plotted sample with the correct time range and data source.",
      "command": "curl -fsS http://127.0.0.1:3000/api/health",
      "next": "Use localhost:3000, not the unconfigured UDS Grafana hostname."
    },
    {
      "id": "producer",
      "title": "Training event producer",
      "zone": "Ubuntu / WSL2",
      "state": "Exercise command",
      "job": "A command sends fictional radio link records to rf-events. No physical RF equipment is connected.",
      "analogy": "Writing a situation report and handing it to dispatch.",
      "evidence": "The producer returns success and the exact record can be consumed.",
      "command": "",
      "next": "Use the Redpanda guide; browser simulator records are separate."
    },
    {
      "id": "redpanda",
      "title": "Redpanda broker",
      "zone": "Docker Compose",
      "state": "User screenshot verified",
      "job": "Stores ordered records per partition. Separate consumer groups track their own progress.",
      "analogy": "A durable dispatch log that several teams can read.",
      "evidence": "Broker responds, topic exists, and a new record is produced and consumed.",
      "command": "docker compose -f integrations/redpanda/compose.yml exec redpanda rpk cluster info",
      "next": "Your screenshot confirmed a broker; fresh message verification is still a separate check."
    },
    {
      "id": "console",
      "title": "Redpanda Console",
      "zone": "Docker Compose",
      "state": "User screenshot verified",
      "job": "Shows broker, topic and consumer information. It does not create radio telemetry automatically.",
      "analogy": "The dispatch supervisor\u2019s view.",
      "evidence": "Open localhost:8088 and inspect the expected topic/message.",
      "command": "",
      "next": "Do not interpret one broker as high availability."
    },
    {
      "id": "demo",
      "title": "Training HTTP app",
      "zone": "Operations Compose",
      "state": "Optional setup included",
      "job": "A small Python service provides a health URL, request counter and JSON log file.",
      "analogy": "A practice service you may safely stop and restore.",
      "evidence": "Visit localhost:18080 and locate the fresh request in Loki.",
      "command": "curl -fsS http://127.0.0.1:18080/health",
      "next": "Use the operations guide to start this separate session."
    },
    {
      "id": "alloy",
      "title": "Alloy log collector",
      "zone": "Operations Compose",
      "state": "Optional setup included",
      "job": "Reads only the exercise log volume and forwards records to Loki. No Docker socket or host-wide logs are mounted.",
      "analogy": "The courier carrying reports to storage.",
      "evidence": "A new demo request appears in Loki, not just a healthy collector process.",
      "command": "",
      "next": "The optional stream-alloy consumer can also read rf-events from Redpanda."
    },
    {
      "id": "loki",
      "title": "Loki log store",
      "zone": "Operations Compose",
      "state": "Optional setup included",
      "job": "Indexes labels and stores log records for search in Grafana.",
      "analogy": "A searchable event notebook.",
      "evidence": "Grafana Explore returns a fresh record with job=\"tpol-operations\".",
      "command": "curl -fsS http://127.0.0.1:13100/ready",
      "next": "Loki is a log backend; it is not a complete SIEM."
    },
    {
      "id": "blackbox",
      "title": "Blackbox HTTP probe",
      "zone": "Operations Compose",
      "state": "Optional setup included",
      "job": "Requests the demo health URL and exposes success/duration metrics to Prometheus.",
      "analogy": "A user checking whether the front door opens.",
      "evidence": "probe_success is 1 for the expected target. It becomes 0 when demo stops.",
      "command": "",
      "next": "This example checks internal Docker routing, not UDS ingress or a SATCOM link."
    },
    {
      "id": "opsprom",
      "title": "Operations Prometheus",
      "zone": "Operations Compose",
      "state": "Optional setup included",
      "job": "Scrapes the demo and Blackbox directly, evaluates alert rules, and sends firing alerts to Alertmanager.",
      "analogy": "Measurements plus a watchstander comparing limits.",
      "evidence": "Fresh targets and alert state visible on localhost:19090.",
      "command": "curl -fsS http://127.0.0.1:19090/-/ready",
      "next": "This is independent of native Prometheus on 9090."
    },
    {
      "id": "opsgraf",
      "title": "Operations Grafana",
      "zone": "Operations Compose",
      "state": "Optional setup included",
      "job": "Queries the provisioned Prometheus and Loki sources.",
      "analogy": "A combined readings and incident-log display.",
      "evidence": "Open localhost:13000 and the TPOL v4 operations exercise dashboard.",
      "command": "",
      "next": "Grafana is not itself proof that the collection pipeline works."
    },
    {
      "id": "alertmanager",
      "title": "Alertmanager",
      "zone": "Operations Compose",
      "state": "Optional setup included",
      "job": "Groups alerts and sends firing/resolved notifications to the local training inbox.",
      "analogy": "The dispatcher deciding where notifications go.",
      "evidence": "A firing alert appears on localhost:19093, followed by a matching inbox record.",
      "command": "",
      "next": "Silencing an alert does not repair the service."
    },
    {
      "id": "inbox",
      "title": "Local alert inbox",
      "zone": "Operations Compose",
      "state": "Optional setup included",
      "job": "Receives training webhooks and stores a bounded history. No email or chat recipient is configured.",
      "analogy": "A practice duty desk mailbox.",
      "evidence": "localhost:18081 contains a fresh firing notification and later resolved.",
      "command": "curl -fsS http://127.0.0.1:18081/",
      "next": "Match timestamps and alert names to your exercise."
    },
    {
      "id": "audit",
      "title": "Connector audit file",
      "zone": "Ubuntu / WSL2",
      "state": "Implemented / verify locally",
      "job": "The bridge records access outcomes and fixed lab actions, without tokens or command output.",
      "analogy": "A local watch log of this app only.",
      "evidence": "SIEM tab shows a new connector event after an authorized action.",
      "command": "",
      "next": "This does not cover Windows or Kubernetes audit events."
    },
    {
      "id": "wazuh",
      "title": "Wazuh SIEM",
      "zone": "Separate Docker session",
      "state": "Optional setup included",
      "job": "Parses collected security events and applies detection rules; manager, indexer and dashboard have distinct jobs.",
      "analogy": "The security analyst reviewing reports for suspicious patterns.",
      "evidence": "A fresh sample indexed with rule.id 100101 and data.training true.",
      "command": "python3 local/siem.py status",
      "next": "Run separately on this PC. Rule-test success is not proof of indexing."
    },
    {
      "id": "devices",
      "title": "SATCOM / network devices",
      "zone": "Future physical sources",
      "state": "Planning only",
      "job": "Expose approved telemetry through supported APIs, SNMPv3, syslog or exporters.",
      "analogy": "The real equipment whose condition you need to know.",
      "evidence": "An agreed source, credentials, time sync and test event from the actual device.",
      "command": "",
      "next": "No radio, sensor, Windows agent or network device is enrolled by this app."
    },
    {
      "id": "exporters",
      "title": "Device / node exporters",
      "zone": "Future collection",
      "state": "Planning only",
      "job": "Translate supported device or OS readings into metrics Prometheus can scrape.",
      "analogy": "An adapter between an instrument and the recorder.",
      "evidence": "Identify whether the target is Windows, WSL, a Kubernetes node, or a router.",
      "command": "",
      "next": "node_exporter in Docker Desktop does not automatically measure the Windows host; choose the correct exporter."
    },
    {
      "id": "otel",
      "title": "OpenTelemetry / traces",
      "zone": "Future collection",
      "state": "Planning only",
      "job": "Instrumented apps emit spans describing steps in a request; a Collector routes them to a trace store such as Tempo.",
      "analogy": "A parcel tracking history for one request.",
      "evidence": "One trace links the same request through its services.",
      "command": "",
      "next": "No trace backend or instrumentation is installed here."
    },
    {
      "id": "identity",
      "title": "Identity / Keycloak",
      "zone": "Future platform services",
      "state": "Planning only",
      "job": "Central login and role mapping determine who can access an app.",
      "analogy": "An identity check at the gate.",
      "evidence": "A test user has the intended role; a denied role really is denied.",
      "command": "",
      "next": "The local bridge token is not SSO. Choose the identity design before exposing services."
    },
    {
      "id": "secrets",
      "title": "Secrets / PKI",
      "zone": "Future platform services",
      "state": "Planning only",
      "job": "Manage credentials, certificate trust, rotation and expiry; examples include a secret manager and cert-manager.",
      "analogy": "Controlled keys with an issue and replacement process.",
      "evidence": "Demonstrate rotation and certificate renewal without lost access.",
      "command": "",
      "next": "Never store passwords in study exports, Git or screenshots."
    },
    {
      "id": "gitops",
      "title": "GitOps / delivery",
      "zone": "Future platform services",
      "state": "Planning only",
      "job": "Reviewed desired-state changes are reconciled by a tool such as Flux or Argo CD. Zarf packages artifacts for delivery.",
      "analogy": "Approved work orders plus a repeatable installer.",
      "evidence": "A reviewed change deploys and a tested rollback restores the prior behavior.",
      "command": "",
      "next": "Choose one reconciliation owner; do not let competing tools manage the same objects."
    },
    {
      "id": "registry",
      "title": "Registry / scanning",
      "zone": "Future supply chain",
      "state": "Planning only",
      "job": "Retain known images, scan dependencies, verify signatures and account for offline updates.",
      "analogy": "An inspected parts store with a traceable inventory.",
      "evidence": "Record image digests, scan findings, signatures, SBOM and an approved exception path.",
      "command": "",
      "next": "A vulnerability scan is not proof that software is safe."
    },
    {
      "id": "storage",
      "title": "Persistent storage",
      "zone": "Future reliability",
      "state": "Planning only",
      "job": "Application state survives process replacement on an appropriate storage backend.",
      "analogy": "The records cabinet.",
      "evidence": "Restart a test workload and confirm its records survive.",
      "command": "",
      "next": "A persistent volume or replica is not an independent backup."
    },
    {
      "id": "backup",
      "title": "Backups / restore",
      "zone": "Future reliability",
      "state": "Planning only",
      "job": "Keep independent copies and rehearse recovery; tools can include Velero and application-native backups.",
      "analogy": "An off-site copy plus a proven way to read it.",
      "evidence": "Restore into an isolated destination, compare data and measure RTO/RPO.",
      "command": "",
      "next": "A copied live database may be inconsistent; use its supported backup method."
    },
    {
      "id": "policy",
      "title": "Network policy / RBAC",
      "zone": "Future controls",
      "state": "Planning only",
      "job": "Limit service-to-service traffic and user/service-account permissions.",
      "analogy": "Doors and access lists between work areas.",
      "evidence": "Allowed requests succeed and denied paths fail from the intended identity.",
      "command": "",
      "next": "Observe baseline traffic before restricting it; keep recovery access."
    },
    {
      "id": "resilience",
      "title": "HA / capacity / time",
      "zone": "Future reliability",
      "state": "Planning only",
      "job": "Plan failure domains, resource limits, time synchronization, DNS and redundancy.",
      "analogy": "Spare capability plus a shared clock and address book.",
      "evidence": "A measured failure exercise preserves the agreed service objective.",
      "command": "",
      "next": "One PC and one broker cannot demonstrate multi-site resilience."
    },
    {
      "id": "ad",
      "title": "Active Directory lab",
      "zone": "Browser-only simulation",
      "state": "Mock lab",
      "job": "Practice a domain, OUs, groups, users, sign-in and resource permissions.",
      "analogy": "A personnel directory plus controlled access to the right workspace.",
      "evidence": "Complete the mock sign-in and allowed/denied resource tests. This is not real AD evidence.",
      "command": "",
      "next": "Open the Active Directory tab to practice the complete workflow."
    }
  ],
  "profiles": {
    "current": {
      "title": "Your lab arrangement",
      "note": "Historical evidence, not a live inventory: UDS and native metrics were previously demonstrated; Redpanda broker/Console were shown in your screenshots. Wazuh ingestion remains unverified.",
      "lanes": [
        [
          "mission",
          "producer",
          "audit"
        ],
        [
          "forward",
          "redpanda"
        ],
        [
          "nativeprom",
          "console",
          "wazuh"
        ],
        [
          "nativegraf"
        ]
      ],
      "edges": [
        [
          "mission",
          "forward",
          "metrics via pod port"
        ],
        [
          "forward",
          "nativeprom",
          "scrape response"
        ],
        [
          "nativeprom",
          "nativegraf",
          "query results"
        ],
        [
          "producer",
          "redpanda",
          "produce records"
        ],
        [
          "redpanda",
          "console",
          "metadata / records"
        ],
        [
          "audit",
          "wazuh",
          "optional configured collection"
        ]
      ]
    },
    "operations": {
      "title": "Optional v4 operations session",
      "note": "Configuration included, not automatically installed. Solid arrows describe configured data paths once started. Dotted Redpanda path needs the stream-alloy add-on. All demo data is fictional.",
      "lanes": [
        [
          "demo",
          "producer"
        ],
        [
          "blackbox",
          "alloy",
          "redpanda"
        ],
        [
          "opsprom",
          "loki",
          "alertmanager"
        ],
        [
          "opsgraf",
          "inbox"
        ]
      ],
      "edges": [
        [
          "demo",
          "blackbox",
          "HTTP response"
        ],
        [
          "demo",
          "alloy",
          "JSON files"
        ],
        [
          "demo",
          "opsprom",
          "scraped counter"
        ],
        [
          "blackbox",
          "opsprom",
          "probe metrics"
        ],
        [
          "opsprom",
          "opsgraf",
          "metric query results"
        ],
        [
          "alloy",
          "loki",
          "log batches"
        ],
        [
          "loki",
          "opsgraf",
          "log query results"
        ],
        [
          "opsprom",
          "alertmanager",
          "rule alerts"
        ],
        [
          "alertmanager",
          "inbox",
          "webhook"
        ],
        [
          "producer",
          "redpanda",
          "produce"
        ],
        [
          "redpanda",
          "alloy",
          "optional stream-alloy consumer"
        ]
      ]
    },
    "future": {
      "title": "Real-deployment planning map",
      "note": "Concepts and example tools only. These are not installed or production-certified by the lab. Select a node to see its purpose and a verification milestone.",
      "lanes": [
        [
          "devices",
          "identity",
          "gitops"
        ],
        [
          "exporters",
          "secrets",
          "registry",
          "otel"
        ],
        [
          "opsprom",
          "redpanda",
          "wazuh",
          "policy"
        ],
        [
          "opsgraf",
          "backup",
          "storage",
          "resilience"
        ]
      ],
      "edges": [
        [
          "devices",
          "exporters",
          "device telemetry"
        ],
        [
          "exporters",
          "opsprom",
          "scrape readings"
        ],
        [
          "opsprom",
          "opsgraf",
          "query results"
        ],
        [
          "devices",
          "redpanda",
          "via configured producer"
        ],
        [
          "identity",
          "wazuh",
          "via configured audit collector"
        ],
        [
          "gitops",
          "registry",
          "approved image references"
        ],
        [
          "registry",
          "policy",
          "verified deployment artifacts"
        ],
        [
          "storage",
          "backup",
          "supported backup workflow"
        ],
        [
          "secrets",
          "identity",
          "credential / trust lifecycle"
        ]
      ]
    },
    "overview": {
      "title": "Operational environment \u2192 collection \u2192 services \u2192 people",
      "note": "A teaching topology inspired by your reference. It combines separate lab sessions and planned equipment; it does not claim they are all installed or running. Metrics go directly to Prometheus, not through Redpanda.",
      "lanes": [
        [
          "devices",
          "mission",
          "producer",
          "audit"
        ],
        [
          "exporters",
          "forward",
          "redpanda",
          "alloy"
        ],
        [
          "nativeprom",
          "loki",
          "wazuh",
          "ad"
        ],
        [
          "nativegraf",
          "opsgraf",
          "console",
          "backup"
        ]
      ],
      "edges": [
        [
          "devices",
          "exporters",
          "planned device metrics"
        ],
        [
          "mission",
          "forward",
          "pod metrics"
        ],
        [
          "forward",
          "nativeprom",
          "scrape response"
        ],
        [
          "exporters",
          "nativeprom",
          "planned scrape readings"
        ],
        [
          "nativeprom",
          "nativegraf",
          "metric query results"
        ],
        [
          "producer",
          "redpanda",
          "produce events"
        ],
        [
          "redpanda",
          "alloy",
          "optional event consumer"
        ],
        [
          "alloy",
          "loki",
          "optional log batches"
        ],
        [
          "loki",
          "opsgraf",
          "log query results"
        ],
        [
          "redpanda",
          "console",
          "event records"
        ],
        [
          "audit",
          "wazuh",
          "optional security collection"
        ],
        [
          "ad",
          "wazuh",
          "planned identity audit feed"
        ],
        [
          "loki",
          "backup",
          "planned backup workflow"
        ]
      ]
    }
  },
  "scenarios": [
    {
      "id": "metrics",
      "profile": "current",
      "title": "Why can metrics be UP during a website outage?",
      "steps": [
        [
          "mission",
          "The pod still exports metrics, but a broken Service selector could stop normal user traffic."
        ],
        [
          "forward",
          "The maintenance connection goes straight to a pod and bypasses ingress."
        ],
        [
          "nativeprom",
          "UP means this scrape endpoint answered; it does not prove the website route."
        ],
        [
          "nativegraf",
          "Inspect the chart, then separately test the normal app URL."
        ]
      ],
      "question": "Which observation proves the normal website path works?",
      "options": [
        [
          "A successful request through tpol-training.uds.dev",
          true,
          "That tests the intended route from that client. Check the response content as well."
        ],
        [
          "A green port-forward metric",
          false,
          "The direct pod route can work while ingress or Service routing is broken."
        ]
      ]
    },
    {
      "id": "outage",
      "profile": "operations",
      "title": "Demo outage \u2192 detection \u2192 notification",
      "steps": [
        [
          "demo",
          "Imagine the practice demo has stopped. The diagram does not stop any real container."
        ],
        [
          "blackbox",
          "The next HTTP probe fails. probe_success becomes 0."
        ],
        [
          "opsprom",
          "The condition must persist for 30 seconds before the rule fires."
        ],
        [
          "alertmanager",
          "Alertmanager groups and routes the alert. A silence would suppress notification, not fix the outage."
        ],
        [
          "inbox",
          "Find the firing message, restore the real demo using the guide, then verify resolved."
        ]
      ],
      "question": "What is the best recovery evidence?",
      "options": [
        [
          "Probe succeeds and a resolved notification arrives",
          true,
          "Check both service recovery and notification flow; keep timestamps."
        ],
        [
          "The alert has been silenced",
          false,
          "A silence changes notification behavior, not service health."
        ]
      ]
    },
    {
      "id": "logs",
      "profile": "operations",
      "title": "Follow a request into searchable logs",
      "steps": [
        [
          "demo",
          "A request writes one fictional JSON log record."
        ],
        [
          "alloy",
          "Alloy tails only the exercise files and forwards records."
        ],
        [
          "loki",
          "Loki stores the entry with low-cardinality labels."
        ],
        [
          "opsgraf",
          "Search for the fresh event in the correct source and time range."
        ]
      ],
      "question": "Loki is ready but your event is absent. What next?",
      "options": [
        [
          "Check source file, collector and time range",
          true,
          "Readiness and successful end-to-end ingestion are separate checks."
        ],
        [
          "Assume the request never happened",
          false,
          "Missing logs can reflect a broken collection path rather than no activity."
        ]
      ]
    },
    {
      "id": "stream",
      "profile": "operations",
      "title": "Radio training record \u2192 Redpanda \u2192 Loki",
      "steps": [
        [
          "producer",
          "Produce a NEW fictional rf-events record after the consumer starts."
        ],
        [
          "redpanda",
          "The broker retains the record; it does not interpret the radio condition."
        ],
        [
          "alloy",
          "The optional stream-alloy add-on consumes with its own tpol-v4-loki group."
        ],
        [
          "loki",
          "The event is ingested as a log with job=rf-events."
        ],
        [
          "opsgraf",
          "Find the exact new exercise record; a green broker alone is not proof."
        ]
      ],
      "question": "Do Prometheus and Wazuh automatically receive this event?",
      "options": [
        [
          "No; each needs its own configured integration",
          true,
          "This path ends in Loki. Metrics and security pipelines have separate contracts."
        ],
        [
          "Yes; all tools are on the same PC",
          false,
          "Sharing a host does not create data subscriptions or collectors."
        ]
      ]
    },
    {
      "id": "restore",
      "profile": "future",
      "title": "Prepare for a failed storage device",
      "steps": [
        [
          "storage",
          "A persistent volume survives some restarts, not every disk or host loss."
        ],
        [
          "backup",
          "Select a consistent backup method and an independent destination."
        ],
        [
          "resilience",
          "Measure acceptable data loss (RPO) and time to restore (RTO)."
        ],
        [
          "backup",
          "Restore into an isolated destination and verify data and application behavior."
        ]
      ],
      "question": "What best proves recoverability?",
      "options": [
        [
          "A successful isolated restore with measured results",
          true,
          "A completed backup job alone does not show that you can recover."
        ],
        [
          "A snapshot exists on the same disk",
          false,
          "That copy can be lost with the disk and may not be application-consistent."
        ]
      ]
    }
  ]
};
