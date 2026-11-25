# Ciencia de datos

Sarnik, una distribuidora de alimentos cerca de Lyon, tiene que decidir: ¿abrir su muelle temprano todas las mañanas de diciembre, o solo cuando los camiones lo necesiten? Naomi, consultora de datos en Seattle, tiene un pronóstico. El martes 10 de noviembre se lo presenta por video a Hugo, que dirige las operaciones de Sarnik, y al director de finanzas.

Naomi: "Ustedes piensan abrir el muelle a las cuatro todas las mañanas de diciembre. A más tardar a las ocho de la noche anterior, el pronóstico puede decir qué mañanas lo necesitan: más de dieciocho camiones entre las cinco y las siete. De doce mañanas así este otoño, señaló diez".

Director de finanzas de Sarnik: "¿Eso lo calculó usted?".

Naomi: "No. Lo construyó un agente de programación que nuestro contrato permite, y lo corrió sobre cuarenta y cuatro mañanas. Antes de que empezara, escogí ocho de ellas y las calculé a mano, usando solo lo que se sabe a las ocho de la noche. En dos de las ocho, el agente sabía algo que yo no encontraba".

Hugo: "¿Qué?".

Naomi: "Los cambios que sus transportistas hacen durante la noche. Había leído los turnos reservados tal como estaban al día siguiente. Con esos cambios, señaló las doce. Sin ellos, diez".

Director de finanzas: "Entonces el número mejor era el equivocado".

Naomi: "Sí".

Director de finanzas: "¿Cómo sabría yo si el diez también está mal?".

Naomi: "Ninguna de las cuarenta y cuatro fue en diciembre. Si en una semana se le escapan dos mañanas cargadas, dejen de usarlo y abran a las cuatro todos los días, como tenían pensado".

Hugo: "Y a las cinco de la mañana, ¿quién responde por él?".

Naomi: "Yo. En Seattle son las ocho de la noche".

Director de finanzas: "Entonces deme una página para la junta directiva".

Hugo: "Y una para la pared del muelle".

## Un número que ella no había calculado

El pronóstico de llegadas de camiones de Naomi corre en una bodega de Sarnik desde julio. En octubre les subió la tarifa a sus dos clientes y conservó a los dos. El hábito de quien calibra, de *A quién le va bien ahora*, ya era suyo.

Su palabra más fuerte en esa llamada fue "No". Todo lo que vino después se podía comprobar. Sarnik necesitaba a alguien que hubiera rehecho un pedazo del cálculo y supiera qué le haría abandonar el resultado. Una máquina puede calcular el resultado. Hablar por él le toca a usted, y se puede entrenar.

Hacen falta tres respuestas: qué se afirma, en qué se apoya y cómo sabría usted si estuviera mal. Salen de la prueba de la segunda pregunta, de *Empiece aquí*. Aplicada a un número:

- *¿Cuál es el punto?* Lo que esta persona haría distinto el lunes si lo creyera.
- *¿En qué se apoya?* Lo que corrió la máquina es *recibido* (*¿Qué tanta seguridad tiene? Dígalo*). Lo que usted rehízo es *comprobado*.
- *¿Hasta dónde llega?* Lo que nunca ha visto, y qué le haría a usted retirarlo.
- *¿Qué quiere de mí?* Una decisión, con su día.
- *¿Quién responde por esto?* Usted, por su nombre.

El pedazo rehecho es el que más trabaja. Escójalo antes de ver el resultado, donde un error costaría más, y use solo lo que se sabía en ese momento. Revisar una muestra es práctica vieja. Escoger primero mantiene la respuesta de la máquina fuera de la suya.

> **Frase para guardar:** Para respaldar un número, diga qué le haría retirarlo.

### Práctica: un número que ya compartió

**Si solo hace una, haga esta.**

**Su turno (15 minutos).** Busque un resultado que calculó una máquina y que usted compartió este mes. Rehaga un pedazo a mano, escogido antes de mirar la respuesta de la máquina. Después cuéntele el resultado a un colega en cinco frases, una por pregunta. **Listo significa** que esa persona puede decir qué pedazo rehízo usted y qué le haría a usted retirar el número.

## Qué está cambiando

Hacer el borrador de la parte visible del trabajo se está volviendo barato (reportado). Lo que no se abarata es saber qué pregunta se respondió, y notar una respuesta equivocada (nuestra apuesta).

*Reportado* es testimonio, muchas veces de gente que vende las herramientas; *comprobado*, solo en estas tablas, tiene detrás un hallazgo publicado, y *nuestra apuesta* es el razonamiento de este libro. *Duradero* se sostuvo en cambios anteriores y se apoya en algo más que testimonio, *apuesta razonable* es buen razonamiento con evidencia escasa, y *abierto* dice qué observar.

| Qué está cambiando | Base | Grado | El paso que vale la pena en cualquier caso |
|---|---|---|---|
| Los agentes redactan la consulta, la variable, el gráfico y el párrafo que va debajo | Reportado | Apuesta razonable | Escriba primero qué tiene que demostrar el resultado |
| A quienes supervisan una automatización se les puede pasar lo que a ella se le pasó, como informa *Ingeniería y arquitectura* | Comprobado | Duradero | Rehaga un pedazo, escogido antes de ver el resultado |
| Los gerentes le hacen sus preguntas de datos a un asistente y se saltan a la persona de análisis | Reportado | Abierto: observe a quién llaman cuando dos respuestas no coinciden | Defina por escrito los pocos números que su empresa repite |
| La confianza en un número se mueve hacia quien dice qué lo retiraría | Nuestra apuesta | Apuesta razonable | Envíe con su regla de parada todo pronóstico sobre el que la gente actúa |

Con eso están cambiando cinco conversaciones.

## La página de la junta y la pared del muelle

Naomi escribió las dos esa tarde. En la llamada también había contado las falsas alarmas: tres mañanas de cuarenta y cuatro. "Cuatro personas, una hora, tres veces", dijo Hugo. "Eso lo puedo pagar".

### Práctica: un resultado, dos páginas

**Primer borrador (lo que una persona cuidadosa de análisis envía a las dos partes).** "El clasificador alcanzó un recall de 0,83 y una precisión de 0,77 en 44 mañanas reservadas para la prueba".

**Qué falla.** Ninguno de los dos lectores puede encontrar una mañana en esas cifras.

**Mejor, para la junta directiva.** "Por favor decidan a más tardar el viernes: abrir el muelle a las cuatro todas las mañanas de diciembre, o solo las mañanas que señale el pronóstico. Recomiendo las señaladas. En cuarenta y cuatro mañanas, eso habría significado trece aperturas tempranas, diez de ellas necesarias. En dos mañanas cargadas el muelle habría abierto demasiado tarde. Lo corrió un agente de programación. Yo rehíce ocho mañanas a mano, encontré una falla y la corregí; ahora coinciden las ocho. Ninguna fue en diciembre. Si en una semana se le escapan dos mañanas cargadas, Hugo vuelve a las cuatro todos los días. Yo respondo por esto".

**Mejor, para la pared.** "Desde hoy, a más tardar a las ocho de la noche, la pantalla del muelle dice *cuatro* o *cinco*. Hasta el 1 de diciembre es una prueba: abran como lo hacen ahora. Después, *cuatro* significa más de dieciocho camiones antes de las siete, y el equipo temprano empieza a las cuatro. Este otoño, ustedes habrían venido temprano para nada en tres mañanas. En dos habría dicho *cinco* y el patio se habría llenado. Si eso pasa, llamen a su líder de turno: lo que ustedes ven vale más que la pantalla. Por favor escriban la fecha abajo. Yo leo esta hoja todos los días. Cuenta camiones y nada más".

**Por qué funciona.** Dos bocetos de quien escucha. En una mañana tranquila, la junta directiva puede perder una hora de salario, y el equipo del muelle, una hora de sueño. Cada página dice qué hace quien la lee cuando el pronóstico se equivoca.

**Su turno (10 minutos).** Tome un resultado con dos lectores: quien paga y la persona a la que le cambia la mañana. Envíele a cada cual tres frases. **Listo significa** que cada cual puede decirle qué haría un día en que esté mal.

## El encargo que olvidó el reloj

Los cambios de la noche se metieron por el primer encargo de Naomi, a finales de octubre. Nunca decía qué hora era, así que el agente leyó la lista que los transportistas editan toda la noche. En el oficio eso se llama *leakage* (fuga de datos): el modelo ve algo que no va a tener llegado el día.

### Práctica: un encargo con reloj

**Primer borrador.** "¿Qué mañanas van a estar cargadas en Sarnik? Use lo que le sirva".

**Qué falla.** Si no se le dice otra cosa, un agente por lo general lee todo lo que tiene a su alcance.

**Mejor.** "Cuente los camiones de mañana entre las cinco y las siete. Son las ocho de la noche: use los turnos reservados que guardé a las ocho, nunca la lista en vivo. Antes de construir, enumere cada campo que va a leer y la hora en que se llena. Después espéreme. No lea estas ocho mañanas".

Volvieron nueve campos. Uno se llena en la entrada, a las seis. Lo tachó.

**Su turno (10 minutos).** Pida esa lista sobre la última variable que un agente construyó para usted. **Listo significa** que un colega puede marcar cada campo *antes* o *después* del pronóstico sin preguntarle a usted.

*Práctica segura: antes de pegar algo en un asistente, cambie nombres y cifras y quite todo lo confidencial, o use una herramienta que su empresa haya aprobado; tome su respuesta como una opinión complaciente, no como una calificación.*

## Nueve gráficos

En octubre un asistente le armó a Naomi una página de nueve gráficos para Claire, que dirige operaciones en Veldhaven, su otro cliente. Al final del mes se había abierto seis veces, cuatro de ellas por Naomi. "¿Tuvo oportunidad de verla?" habría recibido un sí cortés, así que Naomi llamó por teléfono y preguntó otra cosa.

"¿Qué fue lo último que hizo distinto a partir de esa página?".

"Nada. Reenvío la primera línea de su nota semanal".

"Entonces, ¿qué número, en qué valor, debería hacer que usted me llame?".

"Sitio uno, por debajo de siete de cada diez, dos semanas seguidas".

Los nueve gráficos se convirtieron en una línea y una llamada.

### Práctica: dos preguntas para una página

**Su turno (5 minutos).** Diga estas preguntas en voz alta y después hágaselas a una persona que la lea: "¿Qué fue lo último que hizo distinto a partir de esta página?". "¿Qué número, en qué valor, debería hacer que usted me llame?" **Listo significa** que un gráfico tiene un valor y un nombre al lado, o ya no está.

## El número que quiere la patrocinadora

En una cadena de panaderías, una persona de ciencia de datos terminó un piloto de ocho semanas: un pronóstico de cuánto hornear. La directora de tiendas quiere por escrito "el desperdicio bajó una quinta parte". Ya se lo dijo a su director ejecutivo. La cifra la dio la persona de ciencia de datos, en la semana dos.

### Práctica: el número que puede firmar

**Primer borrador.** "Depende de cómo se corten los datos. Las primeras dos semanas sí muestran una quinta parte, así que técnicamente podríamos decir 'hasta'".

**Qué falla.** La ayuda a repetir lo que las otras seis semanas no respaldan.

**Mejor.** "No puedo firmar una quinta parte. En las ocho semanas completas, de cada cien panes que antes tirábamos, salvamos unos diez, entre cinco y catorce. Yo le di dos semanas sin su límite, así que la corrección es mía. ¿La redacto, para que su director ejecutivo la oiga hoy de usted?".

**Su turno (5 minutos).** Para un piloto que todavía no ha dado resultados, envíele una línea a quien lo patrocina: "Vamos a reportar [número] sobre [semanas], diga lo que diga". Acordarlo primero es práctica vieja. **Listo significa** que la respuesta de quien patrocina tiene fecha anterior al primer resultado.

## La mañana en que falló

El miércoles 11 de noviembre era feriado. A las ocho de esa noche pocos transportistas habían reservado turno, y la pantalla dijo *cinco*. El jueves el patio se llenó. Después de un fallo en octubre, Naomi le había guardado silencio a Claire tres días (*Personas difíciles*). Esta vez le escribió a Sarnik a las siete y diez, antes de que nadie preguntara.

### Práctica: el fallo, antes de que pregunten

**Primer borrador.** "Como dije el martes, ningún pronóstico lo capta todo. Un feriado es una limitación conocida, así que yo no sacaría demasiadas conclusiones de una sola mañana".

**Qué falla.** Nunca dice cuántos camiones llegaron, y nadie le había hablado a Sarnik de esa limitación.

**Mejor.** "Dijo cinco, y antes de las siete llegaron veintiséis camiones. Falló. Yo no le había dicho nada de los feriados; esa puede ser la causa, y no lo he comprobado. Sea prueba o no, lo cuento como el primero de dos. Por favor no lo usen el día después de un feriado, y agreguen eso hoy a la página de la junta directiva. A más tardar al mediodía tienen mi comprobación".

Hugo respondió: "Mi líder de turno lo sabía el lunes, y trajo al equipo a las cuatro". Naomi le pidió a esa persona otras mañanas así, y recibió tres. En la pared apareció una línea nueva: "¿Qué sabe usted de mañana que no esté en los turnos reservados?". El viernes la junta directiva eligió las mañanas señaladas, más el día después de cualquier feriado.

> **La investigación dice:** En experimentos de pronóstico, el mismo error le costó a un algoritmo la confianza de la gente más rápido que a una persona que pronosticaba. No es una regla general: en otros experimentos la gente siguió más un consejo cuando le dijeron que venía de un algoritmo, y un experimento de finanzas no encontró una pérdida más rápida después de un error del algoritmo. Así que no adivine cómo van a tomar un fallo; informarlo primero es consejo nuestro.

**Su turno (10 minutos).** Reescriba en ese orden su último informe de un fallo. **Listo significa** que alguien que no estuvo ahí puede decir qué hay que dejar de usar hoy y qué es lo que usted no sabe todavía.

## Tres próximos pasos

1. **Pregunte lo que las tablas no pueden ver.** Este mes, ponga una pregunta junto a un número sobre el que la gente actúa: "¿Qué sabe usted de mañana que no esté en los datos?".
2. **Guarde casos que ningún agente vea.** Este mes, resuelva unos cuantos a mano, guárdelos donde ningún agente pueda leerlos y pruebe con ellos el siguiente resultado.
3. **Dele una página a cada número.** Este mes, tome el que su empresa más repite. Escriba qué cuenta, qué deja por fuera y quién rehízo un pedazo por última vez.

Juntos protegen la frase que solo usted puede respaldar: "Esto es lo que cuenta, lo que no puede ver y lo que me haría retirarlo".

Para comprobar si esto se sostiene todavía, mire dentro de seis meses tres resultados por los que usted habló. Si rehacer un pedazo nunca cambió lo que dijo, hágalo menos. Si un resultado equivocado le llegó a alguien, hágalo más.

## Para los demás

Cambie cuatro preguntas, y mejoran las respuestas que le da su equipo de ciencia de datos.

| Deje de preguntar | Pregunte |
|---|---|
| "¿Me puede sacar el número y ya?" | "Tengo que decidir [esto] a más tardar [día]. ¿Qué me ayudaría?" |
| "¿Qué tan exacto es?" | "¿En cuántos días se habría equivocado, y cuánto nos habría costado eso?" |
| "¿Esto lo hizo la IA?" | "¿Qué pedazo rehízo usted?" |
| "¿Podemos mostrar la cifra mejor?" | "¿Cuál firmaría usted, y qué le haría retirarla?" |

Cuando un asistente le dé una cifra, compártala como algo que le dijeron, y pregunte qué definición usó. Cuando usted sepa algo que los datos no pueden saber, como una calle cerrada o un cliente a punto de irse, dígalo temprano.

## Palabras para usar

- "No, no lo calculé yo. Rehíce [pedazo], y coincidió".
- "A las [hora], eso no lo habríamos sabido".
- "Se habría equivocado en [número] de [número]. Cada vez le cuesta [costo]".
- "Si pasa [esto], deje de usarlo y llámeme".
- "Falló. Esto es lo que sé, y cuándo sabré más".

### Frases que va a oír

- "Directionally right" (acertado en la dirección): la tendencia puede sostenerse. Pregunte en qué se apoya el tamaño.
- "Massage the numbers" (maquillar los números): cambiar lo que se cuenta hasta que el resultado se vea mejor.

## Cuando sale mal

**Tienen más rango que usted y quieren la otra cifra.** Diga una vez, por escrito, qué puede firmar y por qué. Si publican la suya, sale con el nombre de ellos. Si podría dañar o engañar a la gente, use una vía formal.

**"Lo hizo un agente" suena a excusa.** Después de una falla, lo es. Dígalo antes, con lo que usted comprobó. Si su contrato no permite el agente, no lo use.

**Coincidieron ocho, y aun así estaba mal.** Un pedazo rehecho cubre ese pedazo. Diga "ocho", y conserve la regla de parada.

**En una segunda lengua.** Las cuentas se siguen mejor que las proporciones: "diez de doce mañanas" no necesita ningún término. Diga los dos números despacio y después póngalos en el chat.
