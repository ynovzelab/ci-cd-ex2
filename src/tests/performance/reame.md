TOTAL RESULTS 
    // total des assertitions (check)
    checks_total.......................: 806    13.29543/s
    // ce qui est vérifié dans check (timing < 200ms  + statut 200)
    checks_succeeded...................: 51.86% 418 out of 806
    // timing > 200
    checks_failed......................: 48.13% 388 out of 806

    // toutes les requêtes sont passées à 200
    ✓ is status 200
    // 388 sont passés au dessus de 200ms
    ✗ response time OK
      ↳  3% — ✓ 15 / ✗ 388

    HTTP
    // temps de répoinse des requêtes 
    http_req_duration.......................................................: avg=4.91s  min=20.16ms med=5.25s  max=14.84s p(90)=8.28s  p(95)=8.79s 
      { expected_response:true }............................................: avg=4.91s  min=20.16ms med=5.25s  max=14.84s p(90)=8.28s  p(95)=8.79s 
    // statut 200, requête tombées 
    http_req_failed.........................................................: 0.00%  0 out of 806
    // nombre de requêtes 
    http_reqs...............................................................: 806    13.29543/s

    EXECUTION
    // Durée par itération (moyen , ect )
    iteration_duration......................................................: avg=10.83s min=1.16s   med=12.55s max=21.66s p(90)=15.05s p(95)=15.88s
    iterations..............................................................: 403    6.647715/s
    vus.....................................................................: 3      min=3        max=100
    vus_max.................................................................: 100    min=100      max=100

    // Le poid total de la data envoyé 
    // le poid total de la données reçu 

    NETWORK
    data_received...........................................................: 534 kB 8.8 kB/s
    data_sent...............................................................: 307 kB 5.1 kB/s
