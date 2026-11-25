# La explicación

Mateo dibujó durante cuarenta minutos.

Era un martes de la primera semana de agosto, y había volado de Montevideo a Róterdam para esta reunión. Mateo es cofundador y director de tecnología de Tolva, cuyo planificador le dice a cada camión qué puerta de la bodega usar. Veldhaven, un mayorista de alimentos y el cliente más grande de Tolva, abría la revisión de seguridad de los alcances de acceso de Tolva: lo que la credencial del planificador puede leer y cambiar. Cuando Mateo tapó el marcador, la pizarra tenía once cajas, nueve flechas y la vigencia de un token de acceso. En rojo, abajo a la izquierda, estaba por qué un planificador necesita siquiera cambiar reservas. Nada de eso estaba mal, y nada era más grande que lo demás.

Dos personas tenían que decidir con eso. Claire, que dirige operaciones en Veldhaven, tenía una fecha que planear. El sitio uno, la primera de sus tres bodegas, entraría en operación el 14 de setiembre si la revisión pasaba en una ronda, y el 28 si tomaba dos. Otávio, que dirige la seguridad de la información en Veldhaven, tenía que poner su nombre al pie del acceso. Si algún día alguien entraba por ahí, le tocaría a él explicar la intrusión.

"¿Se entiende?", preguntó Mateo.

"Queda claro", dijo Otávio. "Muy completo. Gracias".

Claire le tomó una foto a la pizarra.

El correo de Otávio llegó a las 7:52 de la mañana siguiente, con copia a Claire. "Según nuestra política de seguridad de proveedores, una empresa externa no puede cambiar reservas activas sin una necesidad documentada. No puedo aprobar el acceso tal como se presentó".

La necesidad estaba en la pizarra, en rojo. "Como expliqué ayer", escribió Mateo, y se detuvo. Lo borró y mandó una pregunta: "Cuando alguien le pregunte por qué aprobó nuestro acceso, ¿qué tiene que poder responder?".

Otávio tardó cuatro minutos. "Qué puede cambiar. En qué sitios. Qué tan rápido lo puedo cortar".

Mateo fue a buscar a Claire. Ella le mostró su foto. "¿Cuál parte de esto es mi fecha?".

## Lo que necesita una decisión

Otávio no había cambiado de opinión de un día para otro. Había vuelto a su escritorio con una cosa que decidir y nada que pudiera comprobar, así que abrió la política. "Todavía no puedo saber qué podría cambiar esta credencial" habría ayudado más, dicho en la sala. Pero un fundador acababa de dibujar durante cuarenta minutos, y "¿Se entiende?" pide un sí por cortesía.

Mateo les había explicado cómo funciona la conexión a dos personas que nunca van a construir una. Quien tiene que decidir necesita saber cómo afecta cada opción a aquello por lo que responde, qué tanta seguridad tiene usted y qué cambiaría su consejo. Deles eso, y personas con el doble de su rango y nada de su formación pueden elegir bien con la palabra de usted. Lo demás, téngalo listo para la segunda pregunta.

> **Frase para guardar:** Mientras no puedan decir a qué renunciaron, lo único que usted tiene es un sí con la cabeza.

Hay una prueba para ordenar su material. Tome cada parte y pregunte: si esto funcionara de otra manera, ¿elegirían distinto? Si no, se queda en sus notas. Ahí iba la mayoría de las cajas de Mateo. Un asistente le dibuja las once si se lo pide. Cuáles importan depende de aquello por lo que responden Otávio y Claire, y eso se averigua preguntándoles.

> **La investigación dice:** Un estudio de laboratorio buscó qué predice cuánto sobrestima la gente su comprensión de un aparato. El mejor predictor: mientras más piezas quedaban a la vista, más la sobrestimaban. El estudio usó aparatos cotidianos, no diagramas, así que tomar un sí con la cabeza frente a una pizarra llena como una señal débil es razonamiento de este libro.

## Una elección, dos personas

Mateo hizo un boceto de quien escucha para cada uno (*Quién escucha*): qué sabe, qué tiene que decidir y qué puede perder. Otávio conoce los controles de acceso mejor que Mateo. Tiene que decidir si firma, y puede perder la confianza que le permite firmar cualquier cosa. Claire sabe lo que cuesta mover una entrada en operación. Tiene que elegir una fecha, y puede perder la palabra que le dio a una junta directiva, con el pico que viene en diciembre.

Visto desde ahí, el diseño tenía una sola elección real. La credencial que Mateo había dibujado podía cambiar cualquier reserva en los tres sitios. Ya existía, y hacía mucho más de lo que el planificador necesita. Una credencial más pequeña, una aparte para cada sitio, podía cambiar una sola cosa: la puerta. Construirla tomaría cuatro días, a mitad de la ronda, y el equipo de Otávio tendría que leer el cambio.

Una elección así cabe en un patrón de cuatro espacios:

`Recomiendo [opción], porque [su efecto en aquello por lo que usted responde]. Usted renuncia a [costo]. Yo cambiaría de opinión si [un hecho].`

Ya lleno: "Recomiendo la credencial pequeña, porque nadie que se la robe puede cancelar una reserva. Usted renuncia a cuatro días hábiles, y tal vez al 14. Yo cambiaría de opinión si una credencial no se pudiera limitar a un solo campo".

Diga el costo justo después del beneficio. Dan ganas de saltárselo, porque puede hacerle perder la discusión, y es lo que hace que la decisión sea de ellos.

## Jueves, dos filas

El jueves la pizarra tenía dos filas, la credencial grande y la pequeña, con el mismo camión en las dos. Mateo dijo sus cuatro espacios y después señaló el camión.

"Un camión de tomates enlatados se registra en el sitio uno", dijo. "Nuestro planificador elige la puerta dos, y la credencial escribe 'puerta dos' en la reserva. Eso lo puede hacer cualquiera de las dos. Ahora alguien se roba la credencial. Con la pequeña, puede escribir 'puerta diez'. Un supervisor ve tomates en la puerta equivocada y los mueve. Con la grande, puede cancelar reservas en los tres sitios, y la primera persona en enterarse es un chofer en la entrada de su bodega fría".

Eso es una arquitectura explicada: un caso recorrido dos veces, primero cuando todo funciona y después cuando falla la parte en cuestión. En ingeniería ya se prueban los diseños con escenarios; este es para la persona que decide. La última línea de Mateo dice quién sentiría primero la falla: el hábito de quien lee el sistema, el tipo de pensador hacia el que Mateo va creciendo.

Ahí se detuvo. En el orden de la siguiente pregunta, usted se detiene cuando la siguiente pregunta les toca a ellos.

"¿Por qué solo tal vez el 14?", preguntó Claire.

"Los cuatro días caen dentro de la ronda de Otávio. Si su equipo puede leer el cambio en lo que quede de ella, el 14 se mantiene. Si no, el 28".

"¿Qué tanta seguridad tiene?". Era Otávio, ahí en la sala.

"Lo que puede cambiar la grande lo comprobé ayer en la copia de pruebas. Que una credencial se puede limitar a un solo campo me lo dijo su equipo del sistema de bodega. Los cuatro días los razoné a partir del trabajo que hicimos en la primavera. Qué tan rápido pueden cortar una u otra, nadie lo ha probado. Lo vamos a probar el lunes, y es la razón más probable para que haya una segunda ronda".

Cada parte es una afirmación a la medida con su palabra de base, y lo desconocido viene con un día y un costo. Con eso, quien decide puede planear.

"¿Y si insisto en el 14?".

"Entonces es la credencial grande, y la reducimos en octubre".

"Esa yo no la firmaría", dijo Otávio.

Claire miró las dos filas. "La pequeña. Si necesita una segunda ronda, que la tenga. Prefiero mover una fecha en setiembre que perder una mañana en diciembre".

"Quiero revisar cómo lo expliqué", dijo Mateo. "Otávio, ¿cómo le contaría a su director ejecutivo qué elegimos y a qué renunciamos?".

"Una credencial por sitio. Lee las reservas de ese sitio y cambia una sola cosa, la puerta. Renunciamos a cuatro días, y tal vez a dos semanas". Iba escribiendo mientras hablaba. El expediente ya tenía su necesidad documentada.

El lunes desactivaron una credencial a las nueve, y a las diez seguía funcionando. La razón era la vigencia del token, escrita en la pizarra del martes con la misma tinta que lo demás. El resultado por escrito pidió una segunda ronda, para ver eliminada esa hora. El 20 de agosto Lucía, directora ejecutiva de Tolva, le dijo a Veldhaven: el 28. Ni Claire ni Otávio tuvieron que preguntar por qué.

## ¿Sencillez o precisión?

"Use palabras sencillas" es un buen consejo: un término que quien escucha no conoce puede esconder justo aquello a lo que se opondría. "Mantenga la precisión" también es un buen consejo: una afirmación simplificada puede ser falsa, y quien decida con ella le va a pedir cuentas.

La regla de *La palabra exacta* lo resuelve: palabras sencillas para quien escucha, precisión para la afirmación. Si al simplificarla se vuelve falsa, conserve la precisión y agregue un ejemplo.

Mateo estuvo a punto de decirle a Otávio que la credencial pequeña "solo se mete con las puertas". Eso es sencillo, y es falso: la credencial también lee reservas. Así que dejó exacta la afirmación y le puso los tomates adentro: "Lee las reservas de ese sitio y cambia una sola cosa, la puerta. Quien se la robe podría ver que a las seis llegan tomates. No podría cancelarlos".

| En vez de | Diga | Por qué |
|---|---|---|
| "Corre con permisos de administrador". | "Puede cambiar cualquier reserva en los tres sitios". | Lo que firman es el alcance |
| "Tiene consistencia eventual". | "El conteo de existencias puede tener diez minutos de atraso". | Dice qué tan equivocado puede estar |
| "Escala". | "Probamos tres sitios, nunca cuatro". | Dice hasta dónde llega la afirmación |

## Práctica: lo que el modelo significa para el lunes

**Situación.** Usted construyó un modelo que ordena a los clientes según qué tan probable es que cancelen. La jefa de atención al cliente, que tiene a cuatro personas en los teléfonos, le escribe: "¿Es lo bastante bueno para usarlo?".

**Primer borrador (la respuesta de quien construyó el modelo).**
"Se desempeña bien: el área bajo la curva es 0,87 en el conjunto de prueba. Con un umbral de 0,5, la precisión es 0,60 y el recall es 0,75, pero es ajustable, así que depende de su tolerancia a los falsos positivos. Con gusto le explico la metodología".

**Qué falla.** Usa un vocabulario que el trabajo de ella nunca ha necesitado, y responde "¿Qué tan bueno es el clasificador?". Ella tiene que decidir a quién llaman cuatro personas el lunes, y "ajustable" le devuelve esa decisión sin las opciones.

**Mejor.**
"Sí, para elegir a quién llamar. Recomiendo llamar cada mañana a los 50 clientes que el modelo pone más arriba, que son los que su equipo alcanza a llamar antes del mediodía. Lo corrí con los últimos tres meses y lo comprobé contra los registros. En un día promedio, 30 de esos 50 terminaron cancelando, así que 20 llamadas irían a personas que se iban a quedar. También se le escaparían 10 que cancelaron desde más abajo en la lista. Llamar a 100 alcanza a 7 de esos 10 y toma todo el día. No sé si una llamada hace cambiar de opinión a alguien, porque nadie lo ha medido. Si su equipo deja sin llamar a 10 de los 50, elegidos al azar, en dos semanas tendremos una primera respuesta. Si las llamadas no cambian nada, yo pararía. ¿Cincuenta o cien, a partir del lunes?".

**Por qué funciona.** La pregunta de ella se responde primero, en llamadas y clientes. El costo va junto al beneficio, y lo desconocido que podría revertir la elección viene con una prueba.

**Su turno (10 minutos, por escrito).** Tome una elección que está en su escritorio y que le toca hacer a otra persona. Escríbala en los cuatro espacios, agregue cómo lo sabe y después quite toda frase que dejaría igual esa elección. **Listo significa** que un colega de otro campo la lee una sola vez y puede decir qué recomienda usted, qué cuesta y qué es lo que nadie sabe todavía.

## Práctica: pida el costo de vuelta

**Con una persona.** **Si solo hace una, haga esta.** Esta semana, explíquele una elección real a la persona que la decide, empezando por cómo afecta cada opción a aquello por lo que responde. Después, en lugar de "¿Se entiende?", pida una confirmación de vuelta, como hizo Mateo: ¿cómo le contaría a su jefatura qué elegimos y a qué renunciamos?

Busque el costo en la respuesta. Si solo vuelve el beneficio, recorra un caso con la falla y pregunte otra vez. **Listo significa** que esa persona dijo el costo en sus propias palabras y usted no tuvo nada que corregir. **Forma escrita.** Mande los cuatro espacios y pida la línea que esa persona reenviaría.

**Entrene con una IA.** Ensaye la segunda pregunta antes de que se la hagan.

```text
Haga el papel de la persona que tiene que decidir esto: [puesto, aquello por lo que responde].
No tiene formación técnica. Le voy a explicar una elección en menos de dos minutos. Deténgame una
sola vez, en la primera palabra que solo mi equipo usaría. Cuando termine, hágame las dos preguntas
que necesitaría ver respondidas antes de firmar. Después, como esa persona, escriba la frase que le
reenviaría a su jefatura: qué elegimos y a qué renunciamos. Por último, enumere todo lo que dije
que no habría cambiado su elección.
```

*Práctica segura: antes de pegar algo en un asistente, cambie nombres y cifras y quite todo lo confidencial, o use una herramienta que su empresa haya aprobado; tome su respuesta como una opinión complaciente, no como una calificación.*

## Palabras para usar

- **Antes de preparar.** "Cuando alguien le pregunte por qué aprobó esto, ¿qué tiene que poder responder?".
- **Para abrir.** "Hay dos maneras de hacer esto. Así afecta cada una a [aquello por lo que usted responde]".
- **Lo desconocido.** "Nadie ha probado [qué]. Si sale mal, [lo que le cuesta a usted]. Lo sabremos el [día]".
- **Cuando el detalle no cambia la elección.** "Le puedo mostrar cómo funciona eso. No cambia lo que usted está eligiendo".
- **Cuando el acuerdo llega demasiado rápido.** "Antes de decir que sí, ¿qué necesitaría ver todavía?".

### Frases que va a oír

- "under the hood": cómo funciona por dentro
- "at a high level": solo los puntos principales
- "What's the catch?": ¿a qué renunciamos?

## Cuando sale mal

**Cuando quien decide sabe más que usted.** Las palabras sencillas pueden sonarle a lección a una persona experta. Otávio necesitaba alcance, sitios y minutos exactos, y ningún recorrido. Pregunte primero: "¿Qué parte quiere en detalle?".

**Cuando tiene más rango que usted y quiere una sola respuesta.** "Solo dígame cuál". Dé la recomendación y su costo en una frase, y el mismo día por escrito. Si elige la otra, señale el costo de eso una vez, sin discutir.

**Donde la recomendación va al final.** En algunas empresas la gente sopesa las opciones antes de oír la suya. Pregunte antes, y póngala donde la esperan.

**Cuando una opción está ahí para perder.** Poner una opción débil junto a la suya para que la suya gane es inclinar la balanza. Si hay una opción que usted preferiría que no vieran, póngala en la pizarra.

**Cuando la última pregunta suena a examen.** Hágala sobre su manera de explicar, como Mateo, o pregunte en privado.

**En una segunda lengua.** Elija una palabra para cada cosa y repítala. Una "credencial" que se vuelve "cuenta" y después "usuario" suena a tres cosas. Escriba las opciones en la pizarra antes de hablar, para que nadie tenga que recordarlas.
