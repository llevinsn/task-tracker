---
name: verify-changes
description: Verifica cambios de código en el Task Tracker (refactors, features o fixes en src/, public/ o server.js). Corre el test suite, revisa el diff, confirma que ninguna prueba se haya debilitado, e informa PASA/FALLA con evidencia. Úsala después de cualquier cambio de código antes de darlo por terminado.
---

# Verificar cambios

1. Ejecuta `.claude/skills/verify-changes/check.sh` desde la raíz del proyecto. Corre `npm test` y muestra el diff (resumen y completo).
2. Lee el diff completo, no solo el resumen de `git diff --stat`.
3. Si el diff toca `test/`, confirma que ninguna aserción se haya debilitado (un `assert.equal` cambiado a algo más permisivo, un `test.skip`, o un test eliminado) solo para que la suite pase. Si encontrás eso, es un FALLA aunque los tests estén en verde.
4. Informa el resultado explícitamente — PASA o FALLA — pegando la salida real de `npm test` como evidencia. Nunca digas "debería andar" sin haber corrido el comando.
