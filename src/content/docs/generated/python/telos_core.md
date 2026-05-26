---
title: telos_core
description: API documentation for the Telos Core Python IPC Client.
---

# `telos_core` Python IPC Client

The `CoreIPCClient` is the Python interface used by the Cortex Engine to communicate with the low-level eBPF Telos Daemon (Core). It uses Unix Domain Sockets for high-performance IPC.

## CoreIPCClient Reference

### Connection Management
* **`connect() -> bool`**: Establishes a connection to the Core daemon via Unix Domain Socket (`/var/run/telos.sock`).
* **`close() -> None`**: Closes the active socket connection.
* **`ping_core() -> bool`**: Sends a heartbeat pulse to the Go Daemon.

### Security Commands
* **`send_update_taint(pid: int, taint_level: int) -> bool`**: Pushes a dynamic semantic taint update to the BPF map for the specified agent `pid`.
* **`send_clear_taint(pid: int) -> bool`**: Clears taint for a process (removes from BPF map).
* **`send_update_exec(pid: int, allowed_bins: list, mode: int) -> bool`**: Pushes an execution allowlist policy to the `exec_policy_map`.
* **`send_register_agent(pid: int, comm: str) -> bool`**: Registers an agent process in the tracking map.
* **`update_inode(inode: int, sensitivity: int) -> bool`**: Updates sensitivity for an inode.

### Network Intelligence
* **`update_network(ip: int, allowed: int) -> bool`**: Updates the network allowlist for an IP address.
* **`add_network_rule(ip: int) -> bool`**: Allows traffic to a specific IP.
* **`delete_network(ip: int) -> bool`**: Removes an IP from the allowlist entirely, freeing BPF map space.

### Mirage Defenses
* **`add_mirage_trap(inode: int, honey_id: int, payload: str) -> bool`**: Injects a honey-token trap into the kernel maps for a specific inode.

