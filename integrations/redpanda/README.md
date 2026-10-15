# Redpanda: records in motion

Redpanda is a Kafka-compatible event-streaming platform. A producer submits records, a broker stores them in topic partitions, and consumers read them. Records can serve several applications independently. This is useful for telemetry, event-driven workflows and buffered delivery; it is not itself a SIEM or an automatic RF integration.

## Browser exercise first

The Redpanda tab contains a two-partition simulation. Produce link-up or degraded-link records. Each partition starts at offset 0. Consume with the Operations group and watch only its lag fall. The Security group keeps its own progress. The simulation is explicitly fictional, limited to 100 records, and cleared on page reload. It never contacts a broker or radio.

## Optional real broker

From the app directory in Ubuntu, with Docker Desktop running and Wazuh stopped:

```bash
docker compose -f integrations/redpanda/compose.yml up -d
docker compose -f integrations/redpanda/compose.yml exec redpanda rpk cluster info
```

The broker and Console images are pinned to v26.2.4 and v3.12.0. The training broker uses one core, 1 GiB configured broker memory, and a 1.5 GiB container limit; Console is limited to 512 MiB. These are training bounds, not production sizing. If the broker is killed or restarts, inspect logs and host pressure. UDS plus this lab may still compete for memory; measure, and stop unused services.

Create a topic:

```bash
docker compose -f integrations/redpanda/compose.yml exec redpanda rpk topic create rf-events --partitions 1 --replicas 1
```

`rpk` is the Redpanda command-line tool, available inside the broker container. One partition simplifies ordering; one replica means no broker redundancy. An already-existing topic is expected on a repeated exercise; don't delete it to suppress that message.

Produce:

```bash
echo '{"source":"training-radio","training":true,"link":"up","snr_db":18}' | docker compose -f integrations/redpanda/compose.yml exec -T redpanda rpk topic produce rf-events
```

The pipe sends one JSON line to rpk. `-T` avoids an interactive terminal so standard input reaches the command cleanly. The record is invented for learning, not measured radio signal quality.

Consume:

```bash
docker compose -f integrations/redpanda/compose.yml exec redpanda rpk topic consume rf-events --offset start --num 1
```

`--offset start` reads from the beginning; `--num 1` exits after one record. If it waits, verify that production succeeded and you chose the right topic. This simple command demonstrates reading, not a persistent production consumer group.

Open http://localhost:8088 to inspect rf-events in Console. The broker's external Kafka address is 127.0.0.1:19092 and admin port is bound to 127.0.0.1:19644. These unauthenticated development interfaces are local-only. Container clients use `redpanda:9092`; host clients use the advertised external address. No paid hosted account is created, but Redpanda's own licensing and feature terms still apply.

## Troubleshooting and recovery

```bash
docker compose -f integrations/redpanda/compose.yml ps
docker compose -f integrations/redpanda/compose.yml logs --tail=80 redpanda console
```

- Connection refused: wait for broker readiness and verify ports/listeners.
- Console opens but shows no broker: inspect Console logs and `redpanda:9092` connectivity inside the project.
- Increasing consumer lag: compare production rate, processing rate, failures and partition assignment. A lag value needs its tool/offset context.
- Restarting a one-broker lab interrupts availability. There is no failover broker.
- Replay can cause duplicate downstream actions. Review offset changes and idempotency before replaying production streams.

Stop without removing stored records:

```bash
docker compose -f integrations/redpanda/compose.yml stop
```

Do not add `down -v` unless you deliberately intend to remove the topic volume. No automatic pipeline to Prometheus, Wazuh or physical radio equipment is installed. Those are separate integrations requiring defined data formats, permissions and end-to-end tests.

Sources, reviewed 2026-10-10:
- https://docs.redpanda.com/labs/docker-compose/single-broker/
- https://docs.redpanda.com/streaming/current/get-started/rpk-quickstart/
- https://docs.redpanda.com/streaming/current/get-started/intro-to-rpk/

This package validates configuration structure and learning logic locally, not a live Redpanda deployment on your Windows PC.
