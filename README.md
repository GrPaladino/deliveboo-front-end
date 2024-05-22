<<<<<<< HEAD
# Boolivery is a food delivery platform developed using Vue.js. Here’s how it works:

- Homepage:

  - Users land on the homepage, where they see a list of registered restaurants.
  - These restaurants are fetched from a database using an Axios call.
  - Users can filter the restaurants based on their preferences.

- Restaurant Pages:

  - When users click on a specific restaurant, they are taken to its dedicated page. Here, they can:
    - View the restaurant’s menu.
    - Add desired dishes to their cart.
    - The cart is responsive and remains in memory even if the browser is closed.

- Checkout Process: - After selecting items, users proceed to checkout.
  If the entered data (such as delivery address and payment details) is correct, both the user and the restaurant receive an order confirmation via email.

In summary, Boolivery streamlines the food ordering process by allowing customers to explore menus, customize orders, and receive timely confirmations. It’s a convenient way to enjoy meals from the comfort of home! 😊

## Screen

![screen](/public/screen1.png)

![screen](/public/screen2.png)

![screen](/public/screen3.png)

![screen](/public/screen4.png)

![screen](/public/screen5.png)

![screen](/public/screen6.png)
=======
# Boolivery


## Back-End
Si tratta di un progetto FullStack dove abbiamo suddiviso nel lato back-end l'interfaccia per un eventuale ristoratore, il quale può registrarsi inserendo i propri dati e aggiungendo alla piattaforma il proprio ristorante con le relative caratteristiche richieste.

Successivamente il ristoratore può aggiungere i piatti del proprio ristorante che verranno inseriti in un elenco da cui si possono facilmente aggiungere altri piatti, eliminarli, osservarne nel dettaglio le informazioni, modificare quest'ultime oppure renderli disponibili/non disponibili.

In questa interfaccia è anche possibile monitorare le statistiche relative al numero di ordini dell'ultimo anno, osservandole suddivise nei 12 mesi. Usando la stessa dashboard è possibile vedere anche i guadagni scorporati nello stesso modo e si possono ricontrollare le informazioni degli ordini ricevuti.

## Front-End
Nel front-end un eventuale utente può visualizzare l'elenco di ristoranti, filtrarli per categoria di piatti e selezionare uno di essi verso il quale effettuare il proprio ordine. 

A questo punto si aprirà la schermata del menù con i piatti di cui si possono visualizzare i dettagli e che si possono aggiungere al proprio carrello nelle quantità desiderate.

Dopo aver scelto i piatti del proprio ordine il cliente può procedere nella pagina di acquisto dove può visualizzare un riepilogo dei piatti scelti, delle loro quantità, del loro prezzo sia scorporato, sia complessivo. Dopo aver controllato l'ordine il cliente potrà inserire i propri dati necessari per effettuare la spedizione nei suoi confronti e potrà pagare inserendo i dati della carta di credito.

Infine verrà spedita un'email di conferma dell'ordine al cliente ed una mail di segnalazione dell'ordine al ristoratore che potrà attivarsi per soddisfare la clientela.
>>>>>>> origin/main
