# Ingeniería y arquitectura

A las siete de la mañana del 17 de noviembre, el pull request de un agente esperaba la firma de Diego. La primera línea lo nombraba a él como lector. Había llegado durante la noche: 214 líneas, todas las pruebas en verde, una descripción más clara que las que escribe la mayoría de la gente, y ninguna lista de supuestos.

Diego es el ingeniero destacado con el cliente que Tolva, una empresa de Montevideo cuyo software manda camiones a las puertas de las bodegas, tiene en Veldhaven, en Róterdam. Al sitio tres, la bodega fría de Veldhaven, le faltaban seis días para entrar en operación. Su gerente había pedido una cosa más: que, al dañarse una puerta, se movieran los camiones que la estaban esperando. El lunes, un ingeniero junior en Montevideo le había dado el encargo a un agente de programación y había escrito él mismo doce pruebas. Nada de lo que escribe un agente llega a Veldhaven hasta que una persona de ingeniería de Tolva, con nombre y apellido, lo ha leído, lo ha comprobado contra pruebas que escribió una persona y lo ha firmado.

"Se ve bien", le dijo Diego a una oficina vacía. Después se preguntó en qué se apoyaban esas tres palabras.

Se apoyaban en las pruebas, y todas las pruebas salían de un solo encargo. Mateo, el cofundador que dirige la tecnología de Tolva, quizá sabía qué le había faltado al encargo, pero en Montevideo eran las tres de la mañana. Así que Diego lo leyó otra vez, despacio, diciendo antes de cada rama qué haría después un camión. En la línea 90 no pudo. *Cuando se cierra una puerta*, empezaba el código. La semana anterior él había visto la puerta seis cerrarse después de una carga de arvejas congeladas, quedarse cerrada doce minutos mientras la cámara volvía a enfriarse, y abrirse. No había nada dañado.

¿Qué hace que se cierre una puerta? El encargo no lo decía.

## Qué está cambiando

Los agentes redactan código, pruebas, primeros diseños y la descripción que va encima (reportado). Eso abarata una primera versión. Lo que no abarata (nuestra apuesta) es saber qué va a hacer un cambio en un lugar del que a la máquina nunca le hablaron.

*Reportado*: lo dice gente del oficio, y buena parte de ella vende las herramientas, así que léalo como testimonio. *Comprobado*, solo en estas tablas: lo respalda un hallazgo publicado. *Nuestra apuesta*: el razonamiento de este libro. *Duradero*: se sostuvo en cambios anteriores y se apoya en algo más que testimonio. *Apuesta razonable*: buen razonamiento, evidencia escasa. *Abierto*: nadie lo sabe todavía; la celda dice qué observar.

| Qué está cambiando | Base | Grado | El paso que vale la pena en cualquier caso |
|---|---|---|---|
| Los agentes redactan más del código; las personas dan el encargo, leen y firman | Reportado | Apuesta razonable | Anote qué encuentra su lectura que las pruebas no encontraron |
| A quienes supervisan una automatización se les puede pasar lo que a ella se le pasó; el entrenamiento por sí solo no eliminó eso | Comprobado | Duradero | Compruebe cada cambio contra algo que su autor nunca vio |
| Las primeras versiones de código y de diseños son baratas; terminar y elegir no lo son | Nuestra apuesta | Apuesta razonable | Estime por separado lo que toma terminar |
| Quienes empiezan escriben menos del código con el que aprenden | Reportado | Abierto | Pídales que predigan y después corran. Observe qué detectan |
| Profundidad en un oficio, o amplitud en varios | Reportado, en ambos sentidos | Abierto | Mantenga un oficio a fondo. Observe qué detectan sus revisiones |

Nuestra apuesta, entonces: el trabajo de ingeniería se mueve hacia decir, antes de que un cambio corra, qué va a hacer y hasta dónde llega ese conocimiento. El de arquitectura se mueve hacia elegir un diseño con palabras que otras personas puedan comprobar. Las dos cosas se le dicen a gente que puede objetar, y las dos se pueden entrenar.

> **Frase para guardar:** Usted puede responder por el cambio que puede predecir.

El cambio de Diego pasó ese martes por cinco conversaciones así.

## Lo que comprobó, y hasta dónde llega

A las ocho y media, Diego ya había reproducido el turno de día del lunes a partir del registro del sitio tres, y el pull request necesitaba un comentario. Otávio, que dirige la seguridad de la información en Veldhaven, tiene a dos personas de revisión que leen todo lo que escribe quien firma.

### Práctica: el visto bueno

**Primer borrador (lo que escribe una persona cuidadosa de ingeniería).** "En general se ve bien, un cambio bonito y limpio. Pasan todas las pruebas. Tal vez valga la pena darle otra mirada a la lógica de las puertas en algún momento".

**Qué falla.** Un veredicto sin base, y después una reserva donde debería estar el hallazgo.

**Mejor.** "Sin firmar. Leí las 214 líneas completas, y hacen lo que dice el encargo. Nuestras doce pruebas pasan aquí también. Llega hasta las puertas del sitio tres, que también se cierran después de una carga congelada, para que la cámara vuelva a enfriarse. Reproduje un turno de día, el del lunes: 21 de 23 cierres eran eso, y en 14 de ellos la regla alejó un camión de una puerta sana. Voy a firmar una versión que mueva camiones solo por fallas. ¿Quién puede distinguir las dos cosas? Diego"

**Por qué funciona.** La prueba de la segunda pregunta en una sola pantalla: el punto, en qué se apoya, hasta dónde llega, el pedido, el nombre.

**Su turno (15 minutos).** **Si solo hace una, haga esta.** Abra un cambio que esté por firmar y que no escribió usted. Escoja un dato de entrada del lugar donde va a correr, uno que ninguna prueba use. Antes de correrlo, escriba una predicción que podría fallar: `Si [entrada], entonces [lo que pasa].` Córralo. Después escriba el visto bueno: qué leyó, qué predijo, qué pasó, qué no comprobó. **Listo significa** que un colega que no ha abierto el cambio puede decir qué no comprobó usted.

La gente cuidadosa de ingeniería siempre ha depurado así. Hágalo antes de que algo se dañe.

## Lo que escribió la máquina, contado al cliente

A las diez, en el muelle del sitio tres, el gerente preguntó: "¿Ya entró mi regla de las puertas? Me cuentan que la escribió su máquina".

### Práctica: tres hechos y una pregunta

**Primer borrador (lo que dice una persona cuidadosa de ingeniería).** "Sí usamos desarrollo asistido por IA, pero todo pasa por el mismo proceso riguroso, así que de verdad no hay de qué preocuparse".

**Qué falla.** El gerente preguntó por una regla y recibió una política, y nadie había hablado de preocuparse.

**Mejor.** "La escribió un agente anoche, con un encargo de uno de nuestros ingenieros. La leí esta mañana y no va a entrar, porque toma toda puerta cerrada por una puerta dañada. Aquí no corre nada hasta que uno de nosotros lo haya leído. ¿Qué hace que se cierre una puerta en su muelle cuando no hay nada malo?".

"Las cargas congeladas", dijo el gerente. "Y la limpieza. Todas las puertas, una vez por noche".

Diego había reproducido un turno de día. Si su puesto está donde el cliente, es a usted a quien le preguntan, y está lo bastante cerca para aprender lo que ningún encargo contiene. Llevarlo de vuelta es el hábito de quien traduce.

**Su turno (5 minutos).** Dígalo en voz alta sobre algo que esté entregando: qué escribió la máquina, qué comprobó usted, hasta dónde llega eso. Después pídale al cliente una cosa que solo el cliente sepa. **Listo significa** que usted anotó un hecho que no está en ningún tiquete.

**Entrene con una IA.**

```text
Haga el papel de líder de operaciones en una empresa cliente. Yo voy a describir un cambio que escribió un agente y que estoy por firmar. Pregunte qué comprobé. Interrumpa una vez. Después haga las dos preguntas más difíciles sobre lo que podría llegarle a su personal. Al final, cite cualquier frase mía que haya afirmado más de lo que yo había comprobado.
```

*Práctica segura: antes de pegar algo en un asistente, cambie nombres y cifras y quite todo lo confidencial, o use una herramienta que su empresa haya aprobado; tome su respuesta como una opinión complaciente, no como una calificación.*

## Una firma que nadie puede explicar

A las nueve en Montevideo, Mateo le preguntó al ingeniero junior por un cambio anterior para el sitio tres. Lo había escrito un agente, y él lo había firmado. ¿Qué hace cuando el mismo cierre llega dos veces?

"Lo maneja".

"¿Cómo?".

"Tendría que preguntarle al agente".

### Práctica: cierre primero el agente

**Primer borrador (lo que dice quien lidera con cuidado).** "¿Firmaste algo que no entendés?".

**Qué falla.** Le enseña a decir menos la próxima vez.

**Mejor.** "Gracias por decírmelo. Seguís en el sitio tres. Hasta que podás explicar este cambio, tu firma sale y queda en espera. Cerrá el agente, escribí qué creés que pasa cuando un cierre llega dos veces y después correlo. Mostrame las dos cosas al mediodía, también si te equivocaste".

Al mediodía volvió con una predicción que había fallado. Esperaba que el segundo cierre se ignorara; el código volvía a abrir la puerta. Traía también el arreglo, cuatro líneas escritas a mano, y podía decir qué hacía cada una.

**Su turno (10 minutos).** Con un colega más nuevo, empiece usted. Tome un cambio suyo ya integrado, cierre el agente y prediga qué hace con una entrada que llega dos veces o vacía. Después pídale uno de los suyos. **Listo significa** que cada quien tiene una predicción escrita y su resultado.

## Una noche, y después semanas

A las tres en Róterdam, Claire, que dirige operaciones en Veldhaven, hizo una pregunta justa. "La máquina lo escribió en una noche. ¿Por qué no entra el lunes?".

### Práctica: dos fechas y lo que decide

**Primer borrador (lo que dice una persona cuidadosa de ingeniería).** "Está básicamente al noventa por ciento. Solo quedan unos casos límite, así que ojalá para fin de mes".

**Qué falla.** El porcentaje no tiene base, y los casos límite son el trabajo. Una noche mide solo la parte que alguien ya podía poner en palabras.

**Mejor.** "Para el lunes no, y yo lo dejaría fuera de diciembre. Escribir la regla tomó una noche. Aprender qué cierra sus puertas toma un mes de sus registros. La segunda semana de enero, si con ellos podemos distinguir una falla del resto. Si no, febrero. Lo sabré a más tardar el 18 de diciembre. Mientras tanto, un supervisor mueve el camión en la pantalla".

"Enero", dijo Claire. "Y lleve la cuenta de cuántas veces les toca hacerlo".

**Su turno (5 minutos).** Complete esto, para algo que empezó un agente: `Escribirlo tomó [tiempo]. Lo que falta es [lo que nadie nos ha dicho todavía]. [fecha], si [una cosa]. Si no, [otra fecha]. Lo sabré a más tardar [cuándo].` **Listo significa** que quien escucha puede repetir las dos fechas y lo que decide entre ellas.

## El no del arquitecto

Al pie del pull request, el agente había ofrecido un segundo diseño: conectarse a los controladores de las puertas, que saben por qué se cerró una puerta. Venía con un diagrama, y a Diego le gustó. En una empresa de catorce personas, Mateo es también el arquitecto.

### Práctica: un no que pueden rechazar

**Primer borrador (lo que escribe una persona cuidadosa de arquitectura).** "No. El planificador no debería hablar con el hardware. Es la capa equivocada y sienta un mal precedente".

**Qué falla.** Tres etiquetas. Diego no puede comprobar ninguna, así que solo le queda obedecer o darle la vuelta.

**Mejor (a Diego, Claire y Otávio).** "No a los controladores de las puertas. El equipo de sistemas de Veldhaven me dice que tienen un solo acceso, que lee una puerta y la mueve. Con él, un error nuestro podría pasar de un número en una pantalla a una puerta con alguien debajo. El costo: aprendemos la diferencia con los registros, y eso toma hasta enero. Un acceso que solo pueda leer cambiaría mi respuesta. Otávio responde por el acceso y Claire por las puertas, así que cualquiera de los dos puede rechazar esto. También Diego, con un cierre que los registros no puedan explicar".

Claire respondió antes de una hora: "Mi equipo de sistemas ve la razón de cada cierre. ¿Podría ese equipo agregarla al mensaje que ustedes ya leen?".

"Sí", escribió Mateo. "Y me equivoqué al creer que solo los registros podían decírnoslo".

Ni él ni el agente habían dibujado ese diseño. Claire pudo, porque vio qué protegía el no de Mateo.

Un agente puede dibujar varios diseños que funcionan. Tres juicios siguen siendo de quien hace la arquitectura (nuestra apuesta): qué puede tocar el sistema, qué errores pueden alcanzar a una persona y qué va a ser difícil de deshacer. El patrón es la recomendación de *La explicación*, convertida en un no. Muchos equipos ya registran una decisión, su contexto y sus consecuencias; agregue qué la reabriría, y quién puede hacerlo.

**Su turno (10 minutos).** Reescriba un no que dio este mes: `No a [qué], porque [lo que podría alcanzar]. El costo es [a qué renunciamos]. [Un hecho] cambiaría mi respuesta. [Nombres] pueden rechazar esto.` Envíeselo a una de las personas que nombró. **Listo significa** que esa persona puede decir qué cambiaría la respuesta de usted, o que lo rechazó con una razón.

## ¿Ir a fondo o ir a lo ancho?

*Vaya a fondo*, dice un consejo. Ahora cualquiera puede obtener código verosímil en un lenguaje que nunca ha usado, así que lo que cuenta es ver que está mal. *Vaya a lo ancho*, dice el otro. El cambio que le hace daño cruza tres sistemas, y un agente hace fácil entrar al segundo y al tercero. Nadie sabe cuál es la mezcla correcta (abierto). Mientras tanto, vaya a fondo donde firma y a lo ancho donde pregunta. Conserve un oficio en el que pueda distinguir lo bueno de lo verosímil, porque ese juicio no viene con la herramienta. Y siga extendiéndose: Diego firma integraciones, y sabe lo suficiente de muelles para preguntar qué hace que se cierre una puerta.

## Tres próximos pasos

1. **Prediga antes de correr.** Primer paso este mes: la práctica del visto bueno, en un cambio por semana.
2. **Vaya adonde aterriza su código.** Primer paso: una hora al lado de alguien que lo usa, o en su pantalla compartida si usted trabaja en otro lugar. Traiga de vuelta una cosa que no diga ninguna especificación.
3. **Escriba un no que se pueda rechazar.** Primer paso: envíeselo a la persona que más discutió.

La frase que solo puede respaldar alguien de ingeniería: "Lo predije, lo corrí, y esto es lo que no corrí". La de alguien de arquitectura: "No vamos a dejar que toque eso, y esto es lo que cambiaría mi respuesta".

Para comprobar si esto se sostiene todavía, cuente cada tres meses, un intervalo que fija este libro, lo que encontró la lectura y no habían encontrado las pruebas. Después de dos ceros, sin que nada falle en uso, leer rinde menos en su equipo de lo que he afirmado. Cambie la regla, junto con las personas a las que protege.

## Para quienes trabajan con ingeniería y arquitectura

No hace falta leer código para hacer una buena segunda pregunta.

| En vez de | Diga | Por qué |
|---|---|---|
| "¿Esto lo escribió un agente?" | "¿Quién lo leyó y qué comprobó?" | Cualquier respuesta a la primera le dice poco |
| "¿Ya está listo?" | "¿Qué es lo que nadie ha probado todavía?" | Listo tiene varios sentidos; sin probar tiene uno |
| "Tomó una tarde. ¿Para qué esperar?" | "¿Qué falta, y de qué depende?" | La tarde cubrió lo que ya se sabía |
| "¿Por qué siempre es no?" | "¿Qué cambiaría su respuesta?" | Un no bien dado trae la respuesta lista |

Cuando alguien de ingeniería le diga hasta dónde llega lo que sabe, dele las gracias y planee con eso.

## Palabras para usar

- "Leí [qué]. Corrí [qué]. No comprobé [qué]".
- "Lo redactó un agente, yo lo leí, y lleva mi nombre".
- "¿Qué pasa aquí que a nadie se le ocurriría escribir?".
- "No, por lo que podría alcanzar. [Un hecho] cambiaría mi respuesta".
- "Usted puede rechazar esto. Yo tendría que oír [qué]".

### Frases que va a oír

- "LGTM" ("looks good to me", lo veo bien): pregunte qué miraron.
- "It works on my machine" (en mi máquina funciona): pregunte qué es distinto en la otra.

## Cuando sale mal

**Cuando los cambios llegan más rápido de lo que usted puede leer.** Si se firma todo, la firma pronto no significa nada. Pida cambios más pequeños, y lea primero lo que pueda alcanzar a un cliente.

**Cuando ellos tienen el poder.** Si le dicen que firme hoy, ofrezca por escrito la frase que sí puede firmar: "Lo leí. No lo he probado en el sitio tres". *La presión y cómo resistirla* tiene el resto.

**Cuando se vuelve un examen.** "Explique la línea 90" delante del equipo enseña a esconder. Empiece usted, en privado.

**Cuando decide el contrato.** Lo que usted puede decirle a un cliente sobre sus herramientas tal vez ya esté acordado. Lea eso primero.

**En una segunda lengua.** Escriba el visto bueno antes de la llamada y léalo en voz alta. *Leí*, *corrí*, *no comprobé*: tres líneas cortas llevan toda la afirmación.
