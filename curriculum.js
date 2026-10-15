window.tpolCurriculum = [
  {
    "id": "linux",
    "title": "Linux & WSL",
    "body": "Ubuntu is your Linux distribution; WSL2 runs it within Windows. The shell interprets commands. A relative path starts from your current directory. A Windows C: path usually appears under /mnt/c in WSL. Spaces need quoting. Read before changing: pwd, ls, and cat help establish where you are and what exists.",
    "lab": "Run pwd, then ls. Find local/bridge.py before launching it.",
    "questions": [
      {
        "id": "linux-1",
        "prompt": "Python cannot find local/labctl.py. What should you check first?",
        "options": [
          {
            "text": "pwd and ls",
            "correct": true,
            "explanation": "They establish the working folder and whether the relative path exists."
          },
          {
            "text": "Reinstall Python",
            "correct": false,
            "explanation": "Python already ran and reported a missing file, not a missing interpreter."
          },
          {
            "text": "Delete the project folder",
            "correct": false,
            "explanation": "Deletion destroys evidence and cannot fix an incorrect working directory."
          }
        ]
      },
      {
        "id": "linux-2",
        "prompt": "How do you return to your home directory?",
        "options": [
          {
            "text": "cd ~",
            "correct": true,
            "explanation": "The space separates the command from its home-directory argument."
          },
          {
            "text": "cd~",
            "correct": false,
            "explanation": "The shell treats this as a command named cd~, which usually does not exist."
          },
          {
            "text": "sudo home",
            "correct": false,
            "explanation": "Neither sudo nor an invented home command changes the shell directory."
          }
        ]
      },
      {
        "id": "linux-3",
        "prompt": "What is the relationship between Ubuntu and WSL2?",
        "options": [
          {
            "text": "Ubuntu runs within WSL2",
            "correct": true,
            "explanation": "One is a Linux distribution; the other supplies its Windows-hosted environment."
          },
          {
            "text": "They are mutually exclusive",
            "correct": false,
            "explanation": "You can use Ubuntu inside WSL2 at the same time."
          },
          {
            "text": "Ubuntu is a Docker container",
            "correct": false,
            "explanation": "Your Ubuntu distribution is not the same thing as a Docker application container."
          }
        ]
      },
      {
        "id": "linux-4",
        "prompt": "Why quote a path containing Defense Unicorns Folder?",
        "options": [
          {
            "text": "Keep the spaces inside one argument",
            "correct": true,
            "explanation": "Quotes tell the shell that the complete path belongs together."
          },
          {
            "text": "Encrypt the filename",
            "correct": false,
            "explanation": "Shell quoting does not encrypt data."
          },
          {
            "text": "Give the folder administrator rights",
            "correct": false,
            "explanation": "Permissions are independent of quotes."
          }
        ]
      },
      {
        "id": "linux-5",
        "prompt": "Which command reads a small text file without editing it?",
        "options": [
          {
            "text": "cat README.md",
            "correct": true,
            "explanation": "cat prints the file contents to the terminal."
          },
          {
            "text": "rm README.md",
            "correct": false,
            "explanation": "rm deletes the file rather than displaying it."
          },
          {
            "text": "chmod 777 README.md",
            "correct": false,
            "explanation": "chmod changes permissions and is not a reading command."
          }
        ]
      }
    ]
  },
  {
    "id": "containers",
    "title": "Images, containers & Docker",
    "body": "An image is a packaged filesystem and startup definition. A container is a running or stopped instance with its own state. Docker Desktop supplies the engine for this Windows lab; Ubuntu needs WSL integration to reach it. A stopped container is not necessarily deleted. Named volumes can preserve application data independently of container lifetime.",
    "lab": "Compare docker ps with docker ps -a. Do not remove containers or volumes.",
    "questions": [
      {
        "id": "containers-1",
        "prompt": "Which command lists running containers?",
        "options": [
          {
            "text": "docker ps",
            "correct": true,
            "explanation": "It shows active containers managed by the current Docker engine."
          },
          {
            "text": "docker build",
            "correct": false,
            "explanation": "Build creates an image from build instructions."
          },
          {
            "text": "docker login",
            "correct": false,
            "explanation": "Login authenticates to an image registry."
          }
        ]
      },
      {
        "id": "containers-2",
        "prompt": "An image download succeeded. Does that prove the app is running?",
        "options": [
          {
            "text": "No; inspect the container or pod",
            "correct": true,
            "explanation": "Downloaded software is not evidence of a started, ready application."
          },
          {
            "text": "Yes, download means deployment",
            "correct": false,
            "explanation": "The image can exist without any running instance."
          },
          {
            "text": "Yes, if the file is large",
            "correct": false,
            "explanation": "File size does not establish readiness."
          }
        ]
      },
      {
        "id": "containers-3",
        "prompt": "Docker is unavailable inside Ubuntu, but Docker Desktop is installed. What fits this lab?",
        "options": [
          {
            "text": "Check Desktop is running and Ubuntu WSL integration is enabled",
            "correct": true,
            "explanation": "The distro must reach the Docker Desktop engine."
          },
          {
            "text": "Install three more Docker engines",
            "correct": false,
            "explanation": "Multiple engines can create confusing, separate sets of containers."
          },
          {
            "text": "Rebuild the Zarf training package",
            "correct": false,
            "explanation": "Package contents do not enable WSL integration."
          }
        ]
      },
      {
        "id": "containers-4",
        "prompt": "Which action normally preserves named volumes in a Compose project?",
        "options": [
          {
            "text": "docker compose stop",
            "correct": true,
            "explanation": "Stopping containers keeps them and their named volumes."
          },
          {
            "text": "docker compose down -v",
            "correct": false,
            "explanation": "The -v option removes named volumes and can destroy stored records."
          },
          {
            "text": "Deleting Docker Desktop data",
            "correct": false,
            "explanation": "Deleting engine data removes the state you want to keep."
          }
        ]
      },
      {
        "id": "containers-5",
        "prompt": "Where are your current native Grafana and Prometheus running?",
        "options": [
          {
            "text": "As processes in Ubuntu",
            "correct": true,
            "explanation": "They were launched from downloaded Linux binaries, outside Kubernetes."
          },
          {
            "text": "Inside the mission-api pod",
            "correct": false,
            "explanation": "The training pod contains the sample application, not these native services."
          },
          {
            "text": "In a paid cloud account",
            "correct": false,
            "explanation": "This setup did not create a hosted monitoring account."
          }
        ]
      }
    ]
  },
  {
    "id": "kubernetes",
    "title": "Desired state & readiness",
    "body": "Kubernetes tries to reconcile observed state with declared desired state. A Deployment requests copies of an application; a Pod runs its container or containers. Ready means a pod meets readiness conditions, not that every external request path works. Events describe scheduling and startup problems; logs describe what a running application writes.",
    "lab": "Inspect the Live UDS Lab cards and distinguish desired copies, ready copies, and endpoints.",
    "questions": [
      {
        "id": "kubernetes-1",
        "prompt": "Desired replicas is 0 and no pods exist. What is Kubernetes doing?",
        "options": [
          {
            "text": "Following the requested state",
            "correct": true,
            "explanation": "No copies are requested, so it does not create a replacement."
          },
          {
            "text": "Failing to self-heal",
            "correct": false,
            "explanation": "Self-healing aims for the configured target, which is zero."
          },
          {
            "text": "Keeping two hidden standby pods",
            "correct": false,
            "explanation": "Standby copies are not implied by a zero replica setting."
          }
        ]
      },
      {
        "id": "kubernetes-2",
        "prompt": "Desired is 3 and ready is 1. What does that mean?",
        "options": [
          {
            "text": "Three requested; one currently ready",
            "correct": true,
            "explanation": "Desired and ready are different counts describing target and current state."
          },
          {
            "text": "One active and two guaranteed standbys",
            "correct": false,
            "explanation": "The other two may be pending, failing, or not created yet."
          },
          {
            "text": "Three users and one administrator",
            "correct": false,
            "explanation": "Replica counts describe app copies, not user accounts."
          }
        ]
      },
      {
        "id": "kubernetes-3",
        "prompt": "Which evidence best explains a container that cannot execute its startup command?",
        "options": [
          {
            "text": "Pod events and container state",
            "correct": true,
            "explanation": "Startup can fail before the app has written any logs."
          },
          {
            "text": "Only browser history",
            "correct": false,
            "explanation": "Browser history cannot explain the container runtime failure."
          },
          {
            "text": "Only application logs",
            "correct": false,
            "explanation": "There may be no app process and therefore no logs yet."
          }
        ]
      },
      {
        "id": "kubernetes-4",
        "prompt": "A pod is Running. Is that enough to declare mission access restored?",
        "options": [
          {
            "text": "No; check readiness and test the real URL",
            "correct": true,
            "explanation": "Running is a lifecycle phase, while readiness and end-user access require separate checks."
          },
          {
            "text": "Yes, always",
            "correct": false,
            "explanation": "A running pod may be unready or unreachable through its Service."
          },
          {
            "text": "Only if its name is short",
            "correct": false,
            "explanation": "Pod names have no bearing on service recovery."
          }
        ]
      },
      {
        "id": "kubernetes-5",
        "prompt": "A repair command exits successfully. What comes next?",
        "options": [
          {
            "text": "Observe convergence and verify access",
            "correct": true,
            "explanation": "An accepted change is not proof that rollout and routing have recovered."
          },
          {
            "text": "Immediately close the incident",
            "correct": false,
            "explanation": "You still need recovery evidence."
          },
          {
            "text": "Repeat the fault blindly",
            "correct": false,
            "explanation": "Reintroducing a fault obscures the result you need to verify."
          }
        ]
      }
    ]
  },
  {
    "id": "network",
    "title": "Services, DNS & ingress",
    "body": "A Service selects pods by labels. EndpointSlices describe destinations for that Service. Ingress or a gateway routes requests from outside to the right backend. DNS maps names to addresses; it does not guarantee a working application. A pod port-forward goes through the Kubernetes API and can bypass the Service and ingress path you are trying to test.",
    "lab": "Compare the training URL with the port-forward metrics URL during a controlled Service selector fault.",
    "questions": [
      {
        "id": "network-1",
        "prompt": "Pods are Ready but the Service has no matching endpoints. What should you inspect?",
        "options": [
          {
            "text": "Service selector versus pod labels",
            "correct": true,
            "explanation": "A selector mismatch prevents otherwise healthy pods from becoming destinations."
          },
          {
            "text": "The color of the dashboard",
            "correct": false,
            "explanation": "Visual styling cannot change Kubernetes routing."
          },
          {
            "text": "Reinstall the browser",
            "correct": false,
            "explanation": "A missing Service destination is a cluster-side configuration issue."
          }
        ]
      },
      {
        "id": "network-2",
        "prompt": "Metrics still scrape during Break Service routing. Why is that possible?",
        "options": [
          {
            "text": "The pod port-forward bypasses the broken Service path",
            "correct": true,
            "explanation": "It reaches a selected pod through the API rather than proving normal ingress works."
          },
          {
            "text": "Prometheus repairs selectors automatically",
            "correct": false,
            "explanation": "The collector has not been configured to repair Services."
          },
          {
            "text": "Grafana caches every request forever",
            "correct": false,
            "explanation": "Graph history does not explain a newly successful scrape."
          }
        ]
      },
      {
        "id": "network-3",
        "prompt": "What does a DNS answer establish?",
        "options": [
          {
            "text": "A name resolved to an address",
            "correct": true,
            "explanation": "Reachability, TLS and application response still require testing."
          },
          {
            "text": "The application is healthy",
            "correct": false,
            "explanation": "A correct address can lead to an unavailable service."
          },
          {
            "text": "All pods are ready",
            "correct": false,
            "explanation": "DNS records are not readiness checks for all pods."
          }
        ]
      },
      {
        "id": "network-4",
        "prompt": "Grafana URL returns HTTP 404. What does that show?",
        "options": [
          {
            "text": "An HTTP server answered without a matching resource or route",
            "correct": true,
            "explanation": "Check which server answered, the host route, and whether Grafana is deployed."
          },
          {
            "text": "No network response occurred",
            "correct": false,
            "explanation": "An HTTP status is itself a response."
          },
          {
            "text": "The password is certainly wrong",
            "correct": false,
            "explanation": "404 alone does not establish an authentication failure."
          }
        ]
      },
      {
        "id": "network-5",
        "prompt": "Where should you test to verify a repaired ingress route?",
        "options": [
          {
            "text": "The normal application URL",
            "correct": true,
            "explanation": "This exercises more of the user-facing route than a direct pod connection."
          },
          {
            "text": "Only the pod port-forward",
            "correct": false,
            "explanation": "That route may bypass the fault you repaired."
          },
          {
            "text": "Only a local text file",
            "correct": false,
            "explanation": "A local file cannot validate cluster routing."
          }
        ]
      }
    ]
  },
  {
    "id": "offline",
    "title": "Disconnected operations",
    "body": "An offline web app caches learning files. A disconnected platform needs all required application images, manifests, tooling and dependencies available locally. Zarf can package delivery artifacts, but existing platform services and storage still need preparation. Record versions, hashes and a recovery path before isolating a lab.",
    "lab": "Keep your existing Zarf archive and inspect its filename; do not rebuild just to update the UI.",
    "questions": [
      {
        "id": "offline-1",
        "prompt": "What must be available before a disconnected deployment?",
        "options": [
          {
            "text": "Images, manifests, tools and required dependencies",
            "correct": true,
            "explanation": "A deployment must not rely on unavailable external downloads."
          },
          {
            "text": "Only a bookmark",
            "correct": false,
            "explanation": "A URL is not the software or its dependencies."
          },
          {
            "text": "Only a screenshot of a running pod",
            "correct": false,
            "explanation": "A screenshot cannot recreate the application."
          }
        ]
      },
      {
        "id": "offline-2",
        "prompt": "The learning PWA works offline. Does that prove the whole lab is air-gapped?",
        "options": [
          {
            "text": "No",
            "correct": true,
            "explanation": "Static caching does not demonstrate supply-chain completeness or network isolation."
          },
          {
            "text": "Yes, because the browser opens",
            "correct": false,
            "explanation": "Browser availability tests only one part of the system."
          },
          {
            "text": "Yes, if Wi-Fi is weak",
            "correct": false,
            "explanation": "An unreliable connection is not a defined air-gap boundary."
          }
        ]
      },
      {
        "id": "offline-3",
        "prompt": "What helps verify an archive was not accidentally changed during transfer?",
        "options": [
          {
            "text": "Compare its trusted checksum",
            "correct": true,
            "explanation": "A matching digest supports byte integrity when the expected digest is trusted."
          },
          {
            "text": "Rename it production",
            "correct": false,
            "explanation": "A name does not establish integrity."
          },
          {
            "text": "Open the dashboard theme",
            "correct": false,
            "explanation": "UI styling does not validate archive bytes."
          }
        ]
      },
      {
        "id": "offline-4",
        "prompt": "You update learning text and artwork. Must you rebuild the training workload archive?",
        "options": [
          {
            "text": "No, if workload manifests and images are unchanged",
            "correct": true,
            "explanation": "Static app changes can be delivered separately from the deployed workload."
          },
          {
            "text": "Yes, for every sentence",
            "correct": false,
            "explanation": "The browser files do not automatically change the Kubernetes workload."
          },
          {
            "text": "Delete and recreate the cluster",
            "correct": false,
            "explanation": "This introduces unnecessary loss and downtime."
          }
        ]
      },
      {
        "id": "offline-5",
        "prompt": "A restore plan depends on downloading a tool after disconnecting. What is missing?",
        "options": [
          {
            "text": "A locally prepared recovery dependency",
            "correct": true,
            "explanation": "Recovery must be possible under the conditions being rehearsed."
          },
          {
            "text": "A more colorful checklist",
            "correct": false,
            "explanation": "Presentation cannot replace the missing binary."
          },
          {
            "text": "An extra browser tab",
            "correct": false,
            "explanation": "Tabs do not provide unavailable tooling."
          }
        ]
      }
    ]
  },
  {
    "id": "uds",
    "title": "UDS, Zarf & ownership",
    "body": "Zarf packages images and deployment resources. A UDS Package custom resource declares integration needs such as exposure, policies and monitoring. Installing a CRD teaches Kubernetes a resource type; it does not necessarily install the controller or service implementing that feature. The connector checks a local context and training ownership labels before changing resources.",
    "lab": "Read package/uds-package.yaml, then compare requested integration with installed platform components.",
    "questions": [
      {
        "id": "uds-1",
        "prompt": "A PodMonitor exists but no Prometheus server is installed. Are metrics being collected by it?",
        "options": [
          {
            "text": "No; the definition needs a working collector",
            "correct": true,
            "explanation": "The object expresses a target but does not run the collection service."
          },
          {
            "text": "Yes; YAML files scrape endpoints",
            "correct": false,
            "explanation": "Configuration is not an executing monitoring process."
          },
          {
            "text": "Only when Grafana has a dark theme",
            "correct": false,
            "explanation": "Theme settings have no relationship to collection."
          }
        ]
      },
      {
        "id": "uds-2",
        "prompt": "What is Zarf used for in this lab?",
        "options": [
          {
            "text": "Package and deliver workload images and manifests",
            "correct": true,
            "explanation": "It prepares the transferable deployment artifact."
          },
          {
            "text": "Render Grafana graphs",
            "correct": false,
            "explanation": "Grafana handles visualization of queried measurements."
          },
          {
            "text": "Replace Ubuntu entirely",
            "correct": false,
            "explanation": "Packaging an app does not replace the operating system."
          }
        ]
      },
      {
        "id": "uds-3",
        "prompt": "Why does the bridge require training ownership labels?",
        "options": [
          {
            "text": "Limit mutations to intended lab resources",
            "correct": true,
            "explanation": "A matching name alone does not establish that a resource belongs to this exercise."
          },
          {
            "text": "Make pods start faster",
            "correct": false,
            "explanation": "Labels do not directly speed up startup."
          },
          {
            "text": "Provide encryption keys",
            "correct": false,
            "explanation": "These labels identify scope, not cryptographic material."
          }
        ]
      },
      {
        "id": "uds-4",
        "prompt": "What does a UDS Package request here?",
        "options": [
          {
            "text": "Platform integration for the workload",
            "correct": true,
            "explanation": "The declaration covers networking and monitoring requirements."
          },
          {
            "text": "A guaranteed full SIEM installation",
            "correct": false,
            "explanation": "The training Package does not deploy every platform product."
          },
          {
            "text": "Windows administrator access",
            "correct": false,
            "explanation": "A Kubernetes custom resource does not grant that host privilege."
          }
        ]
      },
      {
        "id": "uds-5",
        "prompt": "The bridge rejects a remote API endpoint. What should you do?",
        "options": [
          {
            "text": "Use the intended loopback k3d context",
            "correct": true,
            "explanation": "The local-only guard is part of the exercise boundary."
          },
          {
            "text": "Remove the guard for convenience",
            "correct": false,
            "explanation": "That expands fault actions to unintended infrastructure."
          },
          {
            "text": "Paste a production credential",
            "correct": false,
            "explanation": "Additional credentials do not change the intended local scope."
          }
        ]
      }
    ]
  },
  {
    "id": "metrics",
    "title": "Prometheus & measurement",
    "body": "A metric is a named numeric measurement, often with labels and timestamps. Prometheus periodically scrapes metrics endpoints and stores samples. up is the success of a scrape, not a universal health verdict. Counters accumulate until reset; gauges move up or down. Rate calculations need multiple samples. Your metrics path currently uses a local port-forward.",
    "lab": "Use Monitoring to read the current scrape status and compare it with the normal app URL.",
    "questions": [
      {
        "id": "metrics-1",
        "prompt": "up is 0 after the port-forward closes. What can you conclude?",
        "options": [
          {
            "text": "Prometheus could not scrape that target",
            "correct": true,
            "explanation": "The app may still be healthy through its normal route."
          },
          {
            "text": "The application definitely crashed",
            "correct": false,
            "explanation": "A broken collection path can produce the same result."
          },
          {
            "text": "The PC has malware",
            "correct": false,
            "explanation": "A failed metrics scrape is not evidence of compromise."
          }
        ]
      },
      {
        "id": "metrics-2",
        "prompt": "What does go_goroutines equal to 9 mean?",
        "options": [
          {
            "text": "Nine concurrent Go tasks in the application",
            "correct": true,
            "explanation": "It is a runtime activity measure, not a direct user or pod count."
          },
          {
            "text": "Nine Kubernetes nodes",
            "correct": false,
            "explanation": "The metric is emitted by the Go process."
          },
          {
            "text": "Nine people logged in",
            "correct": false,
            "explanation": "Goroutines are execution tasks, not authenticated sessions."
          }
        ]
      },
      {
        "id": "metrics-3",
        "prompt": "Why can a CPU rate query have no data immediately after startup?",
        "options": [
          {
            "text": "It needs multiple samples over time",
            "correct": true,
            "explanation": "Rate estimates change across samples; one sample is insufficient."
          },
          {
            "text": "The CPU has been physically removed",
            "correct": false,
            "explanation": "Missing rate data is not hardware proof."
          },
          {
            "text": "The process must be using zero CPU",
            "correct": false,
            "explanation": "No data and zero are different states."
          }
        ]
      },
      {
        "id": "metrics-4",
        "prompt": "Which measurement represents current process RAM in this lab?",
        "options": [
          {
            "text": "process_resident_memory_bytes",
            "correct": true,
            "explanation": "It reports resident process memory in bytes; convert units for readability."
          },
          {
            "text": "go_info",
            "correct": false,
            "explanation": "This metric labels runtime version information."
          },
          {
            "text": "The query load time",
            "correct": false,
            "explanation": "Query latency measures the request to Prometheus, not process RAM."
          }
        ]
      },
      {
        "id": "metrics-5",
        "prompt": "What does the 15-second scrape interval control?",
        "options": [
          {
            "text": "How often Prometheus requests measurements",
            "correct": true,
            "explanation": "Collection cadence affects sample resolution and workload."
          },
          {
            "text": "How long all logs are retained",
            "correct": false,
            "explanation": "Log retention is separate from metric polling."
          },
          {
            "text": "How often passwords change",
            "correct": false,
            "explanation": "Authentication policy is unrelated to scrape cadence."
          }
        ]
      }
    ]
  },
  {
    "id": "grafana",
    "title": "Grafana dashboards",
    "body": "Grafana queries data sources and presents results. It does not invent missing measurements. A data source is a saved connection; a dashboard is a saved collection of panels. Query time range and refresh interval matter. A line that stops at yesterday may be history, not current availability. The local Grafana port is 3000; Prometheus is 9090.",
    "lab": "Import integrations/monitoring/tactical-dashboard.json and map its Prometheus input to your working data source.",
    "questions": [
      {
        "id": "grafana-1",
        "prompt": "Which address belongs in Grafana Prometheus server URL for this native Ubuntu setup?",
        "options": [
          {
            "text": "http://127.0.0.1:9090",
            "correct": true,
            "explanation": "Grafana and Prometheus run in the same Ubuntu environment."
          },
          {
            "text": "http://127.0.0.1:3000",
            "correct": false,
            "explanation": "That is the Grafana interface itself."
          },
          {
            "text": "http://127.0.0.1:9898",
            "correct": false,
            "explanation": "That is the forwarded app metrics endpoint, not the Prometheus query API."
          }
        ]
      },
      {
        "id": "grafana-2",
        "prompt": "Grafana displays a graph from yesterday. Does that prove the app works now?",
        "options": [
          {
            "text": "No; check freshness and current target status",
            "correct": true,
            "explanation": "Stored history can remain visible during an outage."
          },
          {
            "text": "Yes, any line means current health",
            "correct": false,
            "explanation": "The time range and sample age matter."
          },
          {
            "text": "Yes, if the graph is green",
            "correct": false,
            "explanation": "Color alone has no operational meaning."
          }
        ]
      },
      {
        "id": "grafana-3",
        "prompt": "What is a Grafana data source?",
        "options": [
          {
            "text": "A configured connection to a queryable backend",
            "correct": true,
            "explanation": "Here it connects Grafana to Prometheus."
          },
          {
            "text": "A physical fiber cable",
            "correct": false,
            "explanation": "The data source is a software configuration object."
          },
          {
            "text": "A mandatory paid cloud subscription",
            "correct": false,
            "explanation": "A local data source can query a local service."
          }
        ]
      },
      {
        "id": "grafana-4",
        "prompt": "The same query works in Prometheus but fails in Grafana. What is a useful next check?",
        "options": [
          {
            "text": "Data source URL and Save & test",
            "correct": true,
            "explanation": "Verify Grafana reaches the same backend before changing the app."
          },
          {
            "text": "Delete the application deployment",
            "correct": false,
            "explanation": "The evidence points first to the dashboard connection path."
          },
          {
            "text": "Rewrite all Kubernetes labels",
            "correct": false,
            "explanation": "That is unrelated until a query-label issue is demonstrated."
          }
        ]
      },
      {
        "id": "grafana-5",
        "prompt": "A panel shows No data. Which interpretation is most accurate?",
        "options": [
          {
            "text": "The query returned no matching samples",
            "correct": true,
            "explanation": "Check labels, time range, ingestion and scrape status."
          },
          {
            "text": "The measurement is exactly zero",
            "correct": false,
            "explanation": "No samples are not a zero value."
          },
          {
            "text": "The entire cluster was deleted",
            "correct": false,
            "explanation": "A panel alone cannot support that conclusion."
          }
        ]
      }
    ]
  },
  {
    "id": "siem",
    "title": "SIEM & security evidence",
    "body": "SIEM means Security Information and Event Management. A SIEM collects events, parses useful fields and applies rules to help analysts investigate. Wazuh provides an actual security stack; this app also offers an explicitly simulated practice queue. Neither a sample alert nor a running dashboard proves Windows, Kubernetes and network devices are all monitored.",
    "lab": "Load a simulated denied-access sequence, then compare it with authenticated connector audit records.",
    "questions": [
      {
        "id": "siem-1",
        "prompt": "What does a SIEM primarily help you do?",
        "options": [
          {
            "text": "Collect and analyze security events",
            "correct": true,
            "explanation": "It helps correlate evidence and prioritize investigation."
          },
          {
            "text": "Replace all network routing",
            "correct": false,
            "explanation": "Routing packets is not its core role."
          },
          {
            "text": "Guarantee no compromise can occur",
            "correct": false,
            "explanation": "Detection tooling cannot guarantee prevention."
          }
        ]
      },
      {
        "id": "siem-2",
        "prompt": "A failed login alert appears. What is the right initial interpretation?",
        "options": [
          {
            "text": "An event requiring context",
            "correct": true,
            "explanation": "A typo, expired credential or malicious attempt can produce failure."
          },
          {
            "text": "Confirmed attacker inside the host",
            "correct": false,
            "explanation": "The alert alone does not prove successful compromise."
          },
          {
            "text": "Proof of hardware failure",
            "correct": false,
            "explanation": "Authentication events do not establish a broken component."
          }
        ]
      },
      {
        "id": "siem-3",
        "prompt": "What should never be written into the connector audit log?",
        "options": [
          {
            "text": "Bearer tokens and passwords",
            "correct": true,
            "explanation": "They would expose secrets through the evidence system."
          },
          {
            "text": "Event timestamp",
            "correct": false,
            "explanation": "Time is necessary for useful investigation."
          },
          {
            "text": "Action name",
            "correct": false,
            "explanation": "A bounded action name helps explain what changed."
          }
        ]
      },
      {
        "id": "siem-4",
        "prompt": "Wazuh dashboard opens. Is Windows endpoint collection verified?",
        "options": [
          {
            "text": "No; enroll and verify a Windows agent separately",
            "correct": true,
            "explanation": "The central dashboard can run with no Windows agent at all."
          },
          {
            "text": "Yes, because the browser is on Windows",
            "correct": false,
            "explanation": "Viewing a website does not enroll the host."
          },
          {
            "text": "Yes, if Docker is installed",
            "correct": false,
            "explanation": "Docker installation does not establish security log coverage."
          }
        ]
      },
      {
        "id": "siem-5",
        "prompt": "What does a successful wazuh-logtest prove?",
        "options": [
          {
            "text": "The supplied record matched a decoder or rule in that test",
            "correct": true,
            "explanation": "Indexing and dashboard ingestion require separate end-to-end checks."
          },
          {
            "text": "The event is already searchable in the dashboard",
            "correct": false,
            "explanation": "Rule testing is not evidence of the indexing pipeline."
          },
          {
            "text": "All future attacks will be detected",
            "correct": false,
            "explanation": "A single test has a narrow scope."
          }
        ]
      }
    ]
  },
  {
    "id": "triage",
    "title": "Triage & incident decisions",
    "body": "Separate evidence from interpretation. Record event time, source, action, result and affected service. Repeated denials may deserve escalation, but shared clients and bad configuration can create false positives. Acknowledge means an analyst saw the item; it is not containment or remediation. Verify restoration using the mission path and retain an incident note.",
    "lab": "Write a short note: observation, hypothesis, next read-only check, recovery evidence.",
    "questions": [
      {
        "id": "triage-1",
        "prompt": "Five denials arrive within a minute. What is a sensible next action?",
        "options": [
          {
            "text": "Review context and related successful access",
            "correct": true,
            "explanation": "A pattern raises concern but needs attribution and scope."
          },
          {
            "text": "Declare confirmed exfiltration",
            "correct": false,
            "explanation": "There is no evidence of data leaving in those denials alone."
          },
          {
            "text": "Delete every user account",
            "correct": false,
            "explanation": "That is disproportionate and may cause an outage."
          }
        ]
      },
      {
        "id": "triage-2",
        "prompt": "What should an incident note distinguish?",
        "options": [
          {
            "text": "Observed facts from hypotheses",
            "correct": true,
            "explanation": "This prevents assumptions from becoming false evidence."
          },
          {
            "text": "Only green and red colors",
            "correct": false,
            "explanation": "Colors are not a substitute for clear findings."
          },
          {
            "text": "Only the analyst favorite tool",
            "correct": false,
            "explanation": "The record should describe the incident and decisions."
          }
        ]
      },
      {
        "id": "triage-3",
        "prompt": "An analyst acknowledges an alert. Has the underlying fault been repaired?",
        "options": [
          {
            "text": "No",
            "correct": true,
            "explanation": "Acknowledgment records attention; remediation requires an actual change and verification."
          },
          {
            "text": "Yes, acknowledgment restarts everything",
            "correct": false,
            "explanation": "Acknowledgment is not an automatic recovery action here."
          },
          {
            "text": "Yes, because the alert disappears",
            "correct": false,
            "explanation": "Hiding a notification does not change the source system."
          }
        ]
      },
      {
        "id": "triage-4",
        "prompt": "Which timestamp matters when comparing events from two hosts?",
        "options": [
          {
            "text": "Event time with timezone and clock accuracy",
            "correct": true,
            "explanation": "Clock differences can create a misleading sequence."
          },
          {
            "text": "Only the browser refresh time",
            "correct": false,
            "explanation": "Refresh time may differ from when an event occurred."
          },
          {
            "text": "Only the file creation date",
            "correct": false,
            "explanation": "A file can contain many events at different times."
          }
        ]
      },
      {
        "id": "triage-5",
        "prompt": "A repair restores service. What closes the technical loop?",
        "options": [
          {
            "text": "Verify user access and capture the recovery evidence",
            "correct": true,
            "explanation": "This supports a defensible conclusion about mission continuity."
          },
          {
            "text": "Only the command exit code",
            "correct": false,
            "explanation": "The system still needs to converge and serve requests."
          },
          {
            "text": "Erase all logs",
            "correct": false,
            "explanation": "Deleting evidence undermines review and learning."
          }
        ]
      }
    ]
  },
  {
    "id": "redpanda",
    "title": "Redpanda fundamentals",
    "body": "Redpanda is a Kafka-compatible event-streaming platform. A producer writes records to a topic; a broker stores and serves them; a consumer reads them. Think of RF link-status events traveling to several applications. A topic can have partitions, each with an ordered log. An offset is a record position within one partition. This is transport and storage for events, not automatic threat detection.",
    "lab": "Use the browser stream simulator first, then start the optional single-broker Docker lab.",
    "questions": [
      {
        "id": "redpanda-1",
        "prompt": "What does a producer do?",
        "options": [
          {
            "text": "Writes records to a topic",
            "correct": true,
            "explanation": "It sends events into the stream."
          },
          {
            "text": "Automatically labels every event malicious",
            "correct": false,
            "explanation": "Threat classification requires separate logic."
          },
          {
            "text": "Draws Grafana panels",
            "correct": false,
            "explanation": "Visualization is not a producer defining role."
          }
        ]
      },
      {
        "id": "redpanda-2",
        "prompt": "What is a topic?",
        "options": [
          {
            "text": "A named stream of records",
            "correct": true,
            "explanation": "Producers and consumers use it to exchange related events."
          },
          {
            "text": "A Kubernetes readiness probe",
            "correct": false,
            "explanation": "Readiness checks are a different concept."
          },
          {
            "text": "A mandatory user password",
            "correct": false,
            "explanation": "A topic name is not a credential."
          }
        ]
      },
      {
        "id": "redpanda-3",
        "prompt": "What is a consumer offset?",
        "options": [
          {
            "text": "A position in one partition",
            "correct": true,
            "explanation": "It tracks progress through that partition, not a global timestamp."
          },
          {
            "text": "A radio frequency correction",
            "correct": false,
            "explanation": "The same word has a different meaning in streaming."
          },
          {
            "text": "The number of active CPU cores",
            "correct": false,
            "explanation": "Offsets do not measure compute resources."
          }
        ]
      },
      {
        "id": "redpanda-4",
        "prompt": "Is Redpanda itself a SIEM?",
        "options": [
          {
            "text": "No; it can transport events used by security tools",
            "correct": true,
            "explanation": "Rules, investigations and endpoint coverage require additional components."
          },
          {
            "text": "Yes, every broker detects malware",
            "correct": false,
            "explanation": "Brokers store and deliver records without that implied detection."
          },
          {
            "text": "Yes, if the topic is called security",
            "correct": false,
            "explanation": "Names do not create security analysis capability."
          }
        ]
      },
      {
        "id": "redpanda-5",
        "prompt": "What is guaranteed ordering scoped to in the basic partition model?",
        "options": [
          {
            "text": "Within a partition",
            "correct": true,
            "explanation": "Do not assume one total order across every partition."
          },
          {
            "text": "Every topic across all clusters",
            "correct": false,
            "explanation": "That exceeds the ordering scope."
          },
          {
            "text": "The order panels appear in Grafana",
            "correct": false,
            "explanation": "Dashboard layout does not control record ordering."
          }
        ]
      }
    ]
  },
  {
    "id": "streamops",
    "title": "Streaming operations",
    "body": "Consumers may fall behind producers. Lag is a measure of how far consumption progress trails available records; its interpretation depends on the tool and committed offsets. A consumer group distributes partitions among members. Within one group a partition is assigned to one member at a time. Separate groups can independently read the same topic. A one-broker lab has no broker redundancy.",
    "lab": "Create rf-events, produce one harmless JSON record, and consume it with rpk. Observe the offset.",
    "questions": [
      {
        "id": "streamops-1",
        "prompt": "Records arrive faster than a consumer processes them. What may increase?",
        "options": [
          {
            "text": "Consumer lag",
            "correct": true,
            "explanation": "The backlog grows when arrival outpaces progress."
          },
          {
            "text": "The speed of light",
            "correct": false,
            "explanation": "Physical constants do not respond to broker load."
          },
          {
            "text": "The number of guaranteed replicas",
            "correct": false,
            "explanation": "Replication settings are not automatically increased by lag."
          }
        ]
      },
      {
        "id": "streamops-2",
        "prompt": "Two different consumer groups read the same topic. Can each receive its records?",
        "options": [
          {
            "text": "Yes",
            "correct": true,
            "explanation": "Groups maintain independent consumption progress."
          },
          {
            "text": "No; the first group deletes every record",
            "correct": false,
            "explanation": "Consumption does not inherently delete each record for all readers."
          },
          {
            "text": "Only if the producer sends passwords",
            "correct": false,
            "explanation": "Credentials do not define independent group behavior."
          }
        ]
      },
      {
        "id": "streamops-3",
        "prompt": "What is the availability limitation of the one-broker training lab?",
        "options": [
          {
            "text": "No other broker can take over its replicas",
            "correct": true,
            "explanation": "A single broker cannot provide broker-level failover."
          },
          {
            "text": "It has three hidden backups",
            "correct": false,
            "explanation": "The Compose file defines only one broker."
          },
          {
            "text": "It automatically becomes a cloud cluster",
            "correct": false,
            "explanation": "Local deployment does not imply hosted failover."
          }
        ]
      },
      {
        "id": "streamops-4",
        "prompt": "What should you check before resetting a consumer group offset?",
        "options": [
          {
            "text": "Replay impact and duplicate handling",
            "correct": true,
            "explanation": "Re-reading events can repeat downstream side effects."
          },
          {
            "text": "Only the topic spelling",
            "correct": false,
            "explanation": "Correct spelling does not address replay consequences."
          },
          {
            "text": "Nothing; replay is always harmless",
            "correct": false,
            "explanation": "Consumers may send notifications or make state changes."
          }
        ]
      },
      {
        "id": "streamops-5",
        "prompt": "How do you stop the Redpanda lab while retaining its named volume?",
        "options": [
          {
            "text": "docker compose stop for this project",
            "correct": true,
            "explanation": "Stopping preserves the stored topic data."
          },
          {
            "text": "docker compose down -v",
            "correct": false,
            "explanation": "That removes the persistent volume."
          },
          {
            "text": "Delete the Docker data directory",
            "correct": false,
            "explanation": "That destroys more than this lab."
          }
        ]
      }
    ]
  },
  {
    "id": "rf",
    "title": "RF evidence meets platform operations",
    "body": "An RF link can degrade while applications remain partly usable through buffering or alternate paths. Track link availability, loss, latency and relevant radio measurements with timestamps and units. Synthetic RF events in this app teach data flow; they are not readings from a radio. Radio access and metrics require a real supported integration. Start with physical and link evidence before blaming Kubernetes.",
    "lab": "Produce a fictional RF link event and follow it through the stream simulator. Note that no radio was contacted.",
    "questions": [
      {
        "id": "rf-1",
        "prompt": "A sample says snr_db:18. Is that a measurement of your real radio?",
        "options": [
          {
            "text": "No; this lab record is synthetic",
            "correct": true,
            "explanation": "It was created for training and has no connected RF sensor."
          },
          {
            "text": "Yes, all JSON reads radios",
            "correct": false,
            "explanation": "A data format does not create hardware access."
          },
          {
            "text": "Yes, because the field has units",
            "correct": false,
            "explanation": "Units make a record interpretable, not authentic."
          }
        ]
      },
      {
        "id": "rf-2",
        "prompt": "RF throughput drops while pods stay Ready. What should you investigate?",
        "options": [
          {
            "text": "The external link and end-to-end path",
            "correct": true,
            "explanation": "Pod readiness does not establish RF link capacity."
          },
          {
            "text": "Only rename the namespace",
            "correct": false,
            "explanation": "Renaming does not address external link degradation."
          },
          {
            "text": "Assume there is no problem",
            "correct": false,
            "explanation": "Ready pods can coexist with poor user connectivity."
          }
        ]
      },
      {
        "id": "rf-3",
        "prompt": "Why include units in telemetry?",
        "options": [
          {
            "text": "Avoid ambiguous interpretation",
            "correct": true,
            "explanation": "Milliseconds, seconds and decibels describe different quantities."
          },
          {
            "text": "To encrypt measurements",
            "correct": false,
            "explanation": "Units do not provide confidentiality."
          },
          {
            "text": "To automatically fix interference",
            "correct": false,
            "explanation": "Metadata does not repair a radio link."
          }
        ]
      },
      {
        "id": "rf-4",
        "prompt": "An RF event arrives several minutes late. Which extra field helps?",
        "options": [
          {
            "text": "The original event timestamp",
            "correct": true,
            "explanation": "It distinguishes occurrence time from receipt time."
          },
          {
            "text": "Only the UI color",
            "correct": false,
            "explanation": "Color cannot recover the event time."
          },
          {
            "text": "An arbitrary larger offset",
            "correct": false,
            "explanation": "Offset position alone is not wall-clock time."
          }
        ]
      },
      {
        "id": "rf-5",
        "prompt": "Before an invasive repair, what supports mission continuity?",
        "options": [
          {
            "text": "Assess impact and available alternate paths",
            "correct": true,
            "explanation": "A proportionate recovery plan can preserve service while troubleshooting."
          },
          {
            "text": "Reset all equipment at once",
            "correct": false,
            "explanation": "That may remove redundancy and erase evidence."
          },
          {
            "text": "Ignore users until graphs are perfect",
            "correct": false,
            "explanation": "Operational impact matters alongside telemetry."
          }
        ]
      }
    ]
  },
  {
    "id": "change",
    "title": "Safe upgrades & recovery",
    "body": "Preserve the existing deployment, monitoring data and browser origin while updating the learning app. Use explicit contexts. Back up progress before changing hostnames or ports because browser storage is origin-specific. Start a service, verify its actual function, and only then record success. Stop heavy optional labs when finished. Separate installed, running, reachable and healthy in your reports.",
    "lab": "Export study progress, read UPGRADE.md, and explain which files changed without rebuilding mission-api.",
    "questions": [
      {
        "id": "change-1",
        "prompt": "Why might study progress look missing after changing localhost to 127.0.0.1?",
        "options": [
          {
            "text": "Browser storage is tied to the origin",
            "correct": true,
            "explanation": "Different hostnames can have separate local storage."
          },
          {
            "text": "The Kubernetes pod erased it",
            "correct": false,
            "explanation": "The study progress is stored in the browser."
          },
          {
            "text": "The artwork deleted the database",
            "correct": false,
            "explanation": "Images do not manage the progress store."
          }
        ]
      },
      {
        "id": "change-2",
        "prompt": "Why run Wazuh separately on this 16 GB PC?",
        "options": [
          {
            "text": "Its stack competes with UDS for limited memory",
            "correct": true,
            "explanation": "The Docker allocation is smaller than the physical host total."
          },
          {
            "text": "Wazuh cannot use any CPU",
            "correct": false,
            "explanation": "It uses CPU and memory like other services."
          },
          {
            "text": "Grafana requires a paid upgrade first",
            "correct": false,
            "explanation": "Paid Grafana is not the relevant constraint."
          }
        ]
      },
      {
        "id": "change-3",
        "prompt": "What is a good upgrade rollback preparation?",
        "options": [
          {
            "text": "Keep the previous app folder and export progress",
            "correct": true,
            "explanation": "This preserves a practical path back if the new UI fails."
          },
          {
            "text": "Delete all previous packages first",
            "correct": false,
            "explanation": "That removes useful recovery artifacts."
          },
          {
            "text": "Change every service port",
            "correct": false,
            "explanation": "Unnecessary port changes complicate troubleshooting."
          }
        ]
      },
      {
        "id": "change-4",
        "prompt": "Which status wording is most accurate immediately after compose up succeeds?",
        "options": [
          {
            "text": "Startup requested; verify service readiness",
            "correct": true,
            "explanation": "Container creation alone does not prove the service is useful."
          },
          {
            "text": "Everything is healthy forever",
            "correct": false,
            "explanation": "Health can change and needs evidence."
          },
          {
            "text": "Security coverage complete",
            "correct": false,
            "explanation": "Coverage depends on actual sources and detections."
          }
        ]
      },
      {
        "id": "change-5",
        "prompt": "What should you do if a live reading is stale?",
        "options": [
          {
            "text": "Refresh and check the measurement path",
            "correct": true,
            "explanation": "Old samples cannot establish current health."
          },
          {
            "text": "Treat the old value as current indefinitely",
            "correct": false,
            "explanation": "An old successful sample can hide a current outage; check its age and the collection path."
          },
          {
            "text": "Replace no data with zero",
            "correct": false,
            "explanation": "Inventing a value hides uncertainty."
          }
        ]
      }
    ]
  },
  {
    "id": "observe4",
    "title": "Logs, probes and notifications",
    "body": "A readiness endpoint tells you a process is ready. To prove a pipeline, generate a known event and find it at the destination. Alloy collects logs, Loki stores them, Grafana queries them. Blackbox measures an HTTP target, Prometheus evaluates rules and Alertmanager routes notifications.",
    "lab": "Run the optional operations exercise. Record the time of a request, a firing alert and a resolved alert.",
    "questions": [
      {
        "id": "observe4-1",
        "prompt": "Which route matches the operations log exercise?",
        "options": [
          {
            "text": "Demo file \u2192 Alloy \u2192 Loki \u2192 Grafana",
            "correct": true,
            "explanation": "The file is the source, Alloy transports it, Loki stores it and Grafana queries it."
          },
          {
            "text": "Demo \u2192 Prometheus \u2192 Kibana",
            "correct": false,
            "explanation": "Prometheus handles numeric measurements; this lab has no Kibana log backend."
          },
          {
            "text": "Grafana \u2192 Redpanda \u2192 radio",
            "correct": false,
            "explanation": "The dashboard does not configure or command physical RF equipment."
          }
        ]
      },
      {
        "id": "observe4-2",
        "prompt": "Blackbox reports probe_success=0. What does that mean?",
        "options": [
          {
            "text": "The configured probe failed",
            "correct": true,
            "explanation": "Investigate the selected target, network path and probe configuration before declaring a whole-site outage."
          },
          {
            "text": "Every host in the network is down",
            "correct": false,
            "explanation": "One probe covers one configured check, not all possible hosts and services."
          },
          {
            "text": "The SIEM confirmed compromise",
            "correct": false,
            "explanation": "A failed health check alone does not establish a security incident."
          }
        ]
      },
      {
        "id": "observe4-3",
        "prompt": "What does an Alertmanager silence change?",
        "options": [
          {
            "text": "Notification behavior for matching alerts",
            "correct": true,
            "explanation": "The underlying rule and service fault may remain; verify recovery separately."
          },
          {
            "text": "The application is repaired",
            "correct": false,
            "explanation": "Silences are operational notification controls, not remediation commands."
          },
          {
            "text": "All logs are deleted",
            "correct": false,
            "explanation": "Silencing does not delete the underlying log or metric history."
          }
        ]
      },
      {
        "id": "observe4-4",
        "prompt": "Loki /ready responds but your new log is absent. What next?",
        "options": [
          {
            "text": "Inspect the source, collector and query time range",
            "correct": true,
            "explanation": "Service readiness does not prove the specific record arrived end to end."
          },
          {
            "text": "Mark log ingestion verified",
            "correct": false,
            "explanation": "You need the fresh expected record to support that conclusion."
          },
          {
            "text": "Immediately delete the storage volume",
            "correct": false,
            "explanation": "Destroying evidence is not an appropriate first diagnostic step."
          }
        ]
      },
      {
        "id": "observe4-5",
        "prompt": "How are the two Grafana instances separated?",
        "options": [
          {
            "text": "Native uses 3000; operations uses 13000",
            "correct": true,
            "explanation": "The new exercise has its own data sources and database, preserving native monitoring."
          },
          {
            "text": "Both replace the same database",
            "correct": false,
            "explanation": "The supplied Compose configuration uses a separate named volume."
          },
          {
            "text": "The operations instance is automatically in UDS",
            "correct": false,
            "explanation": "The optional stack runs in Docker Compose alongside the cluster."
          }
        ]
      }
    ]
  },
  {
    "id": "identity4",
    "title": "Identity, permissions and trust",
    "body": "Authentication answers who you are. Authorization answers what you may do. SSO can centralize login; RBAC limits actions. Certificates establish trust and expire. Secrets need restricted access and rotation. These capabilities require deliberate integration; a local bridge token is not enterprise identity.",
    "lab": "On paper, define observer and operator roles. State one allowed and one denied action for each.",
    "questions": [
      {
        "id": "identity4-1",
        "prompt": "A user logs in but cannot change a deployment. Which distinction matters?",
        "options": [
          {
            "text": "Authentication succeeded; authorization may deny the action",
            "correct": true,
            "explanation": "Login and permission checks answer different questions and need separate evidence."
          },
          {
            "text": "Login always grants administrator rights",
            "correct": false,
            "explanation": "Successful authentication does not imply unrestricted permission."
          },
          {
            "text": "The DNS server must be broken",
            "correct": false,
            "explanation": "A permission denial is not evidence of a name-resolution failure."
          }
        ]
      },
      {
        "id": "identity4-2",
        "prompt": "What does adding a Keycloak icon to a diagram accomplish?",
        "options": [
          {
            "text": "It documents a proposed identity component",
            "correct": true,
            "explanation": "Clients, roles, redirect URLs and trust still need configuration and testing."
          },
          {
            "text": "It automatically enables SSO",
            "correct": false,
            "explanation": "A drawing does not provision identity clients or change authentication."
          },
          {
            "text": "It replaces every Kubernetes ServiceAccount",
            "correct": false,
            "explanation": "Workload identity and interactive user sign-in have distinct requirements."
          }
        ]
      },
      {
        "id": "identity4-3",
        "prompt": "A private-CA certificate is rejected. What is the sound production approach?",
        "options": [
          {
            "text": "Check hostname, expiry, clock and CA trust",
            "correct": true,
            "explanation": "Repair the trust path and keep verification enabled for the intended endpoint."
          },
          {
            "text": "Disable TLS verification permanently",
            "correct": false,
            "explanation": "That hides trust failures and weakens protection instead of fixing the cause."
          },
          {
            "text": "Publish the private key in a support screenshot",
            "correct": false,
            "explanation": "Private keys must remain secret; share non-sensitive diagnostics instead."
          }
        ]
      },
      {
        "id": "identity4-4",
        "prompt": "Where should you put a real access token while studying?",
        "options": [
          {
            "text": "In the approved credential store, not the notebook",
            "correct": true,
            "explanation": "Notes and progress exports are not designed as secret storage."
          },
          {
            "text": "Inside a Git commit for convenience",
            "correct": false,
            "explanation": "Repository history can expose credentials even after later deletion."
          },
          {
            "text": "In a public screenshot beside the dashboard",
            "correct": false,
            "explanation": "A screenshot can disclose a reusable secret to unintended viewers."
          }
        ]
      },
      {
        "id": "identity4-5",
        "prompt": "What evidence supports least privilege?",
        "options": [
          {
            "text": "Required actions succeed and forbidden actions fail",
            "correct": true,
            "explanation": "Test both sides using the intended identity rather than only an administrator."
          },
          {
            "text": "Every operator has cluster-admin",
            "correct": false,
            "explanation": "Broad administrator rights do not demonstrate the minimum needed permissions."
          },
          {
            "text": "Only the login page loads",
            "correct": false,
            "explanation": "Page availability does not validate authorization policy."
          }
        ]
      }
    ]
  },
  {
    "id": "delivery4",
    "title": "GitOps, registries and offline delivery",
    "body": "Desired state is the reviewed configuration you intend to run. A reconciler such as Flux compares it to actual state. Registries hold images; scanners and signatures add evidence about contents and origin. Offline delivery must account for images, charts, configuration, licenses, trust and updates.",
    "lab": "Write a change ticket containing owner, version, expected effect, validation and rollback. Identify every external dependency.",
    "questions": [
      {
        "id": "delivery4-1",
        "prompt": "Why might a manual kubectl change disappear under GitOps?",
        "options": [
          {
            "text": "The reconciler restores the declared desired state",
            "correct": true,
            "explanation": "Change the authoritative configuration through the agreed workflow or coordinate a documented emergency exception."
          },
          {
            "text": "The image registry erased the cluster",
            "correct": false,
            "explanation": "Registry storage does not normally reconcile Kubernetes specifications."
          },
          {
            "text": "Prometheus rewrites deployments",
            "correct": false,
            "explanation": "Prometheus collects metrics and evaluates rules; it does not own desired deployment state."
          }
        ]
      },
      {
        "id": "delivery4-2",
        "prompt": "What does an image digest identify?",
        "options": [
          {
            "text": "A specific content-addressed image artifact",
            "correct": true,
            "explanation": "A digest is more precise than a mutable tag, but does not itself prove the artifact is safe."
          },
          {
            "text": "The name of the person currently logged in",
            "correct": false,
            "explanation": "User identity is separate from the identity of an image artifact."
          },
          {
            "text": "A guarantee of zero vulnerabilities",
            "correct": false,
            "explanation": "Known content can still contain vulnerabilities or unsuitable configuration."
          }
        ]
      },
      {
        "id": "delivery4-3",
        "prompt": "What is an SBOM useful for?",
        "options": [
          {
            "text": "Understanding included software components",
            "correct": true,
            "explanation": "It supports inventory and vulnerability analysis but is not a blanket security approval."
          },
          {
            "text": "Proving every dependency is harmless",
            "correct": false,
            "explanation": "A component inventory does not eliminate exploitable flaws or misuse."
          },
          {
            "text": "Replacing all runtime logs",
            "correct": false,
            "explanation": "An SBOM describes software composition, not actual runtime activity."
          }
        ]
      },
      {
        "id": "delivery4-4",
        "prompt": "What should an offline rehearsal verify?",
        "options": [
          {
            "text": "All required artifacts and trust material are locally available",
            "correct": true,
            "explanation": "Also verify installation, operation, recovery and the future update process without relying on external services."
          },
          {
            "text": "Only the HTML page opens",
            "correct": false,
            "explanation": "A cached page does not prove container images or platform dependencies are available."
          },
          {
            "text": "The internet connection is fast",
            "correct": false,
            "explanation": "External connectivity does not demonstrate disconnected operation."
          }
        ]
      },
      {
        "id": "delivery4-5",
        "prompt": "What belongs in a rollback plan?",
        "options": [
          {
            "text": "A known prior version and a tested recovery procedure",
            "correct": true,
            "explanation": "Include data compatibility, ownership and measurable validation, not only an old binary."
          },
          {
            "text": "A promise that no update can fail",
            "correct": false,
            "explanation": "Changes can fail even when well planned; recovery needs concrete steps."
          },
          {
            "text": "Deleting all volumes if startup is slow",
            "correct": false,
            "explanation": "Routine rollback should preserve needed data and avoid unplanned destruction."
          }
        ]
      }
    ]
  },
  {
    "id": "recovery4",
    "title": "Backups, capacity and recovery evidence",
    "body": "RPO is the acceptable amount of data loss measured in time. RTO is the target time to restore service. A persistent volume is not an independent backup. Restore drills should use isolated destinations, verify contents and measure results. One machine remains one failure domain even with many containers.",
    "lab": "Run python3 local/recovery_drill.py. It creates only fictional files in a new directory and demonstrates a backed-up record versus a later record.",
    "questions": [
      {
        "id": "recovery4-1",
        "prompt": "What best proves a backup can support recovery?",
        "options": [
          {
            "text": "A successful verified restore into an isolated destination",
            "correct": true,
            "explanation": "Check contents and application behavior and measure the elapsed recovery time."
          },
          {
            "text": "The backup filename looks correct",
            "correct": false,
            "explanation": "A filename does not prove completeness, integrity or recoverability."
          },
          {
            "text": "The source volume still exists",
            "correct": false,
            "explanation": "Continued source availability does not test your independent recovery copy."
          }
        ]
      },
      {
        "id": "recovery4-2",
        "prompt": "A backup lacks the newest transaction. Which objective concerns that gap?",
        "options": [
          {
            "text": "RPO",
            "correct": true,
            "explanation": "Recovery Point Objective concerns the acceptable time span of lost data."
          },
          {
            "text": "RTO",
            "correct": false,
            "explanation": "Recovery Time Objective concerns elapsed time to restore service."
          },
          {
            "text": "MTU",
            "correct": false,
            "explanation": "Maximum Transmission Unit concerns packet size, not backup freshness."
          }
        ]
      },
      {
        "id": "recovery4-3",
        "prompt": "Three replicas run on one PC. What failure remains shared?",
        "options": [
          {
            "text": "Loss of that PC or its underlying resources",
            "correct": true,
            "explanation": "Replicas on one host cannot provide independence from all host-level failures."
          },
          {
            "text": "No failures are possible anymore",
            "correct": false,
            "explanation": "Replication reduces some risks but does not eliminate all failure modes."
          },
          {
            "text": "A guaranteed three-site disaster recovery design",
            "correct": false,
            "explanation": "Multiple replicas do not imply separate buildings or independent power and storage."
          }
        ]
      },
      {
        "id": "recovery4-4",
        "prompt": "Why can copying a live database directory be unreliable?",
        "options": [
          {
            "text": "The copied files may not represent a consistent transaction state",
            "correct": true,
            "explanation": "Use the database-supported backup or coordinated snapshot procedure and test restore."
          },
          {
            "text": "All file copies automatically encrypt the data",
            "correct": false,
            "explanation": "Copying alone provides neither encryption nor consistency guarantees."
          },
          {
            "text": "Only file names matter during restore",
            "correct": false,
            "explanation": "Recovery depends on coherent contents, schema and application compatibility."
          }
        ]
      },
      {
        "id": "recovery4-5",
        "prompt": "Exit 137 appears while several labs run. What is a useful next check?",
        "options": [
          {
            "text": "Check memory usage and whether the container was OOM-killed",
            "correct": true,
            "explanation": "Inspect container state and resource pressure before assuming a particular cause."
          },
          {
            "text": "Keep starting more replicas immediately",
            "correct": false,
            "explanation": "More processes may worsen pressure and do not identify the reason for termination."
          },
          {
            "text": "Delete the entire UDS cluster first",
            "correct": false,
            "explanation": "A destructive reset is not required to investigate a container termination."
          }
        ]
      }
    ]
  }
];
