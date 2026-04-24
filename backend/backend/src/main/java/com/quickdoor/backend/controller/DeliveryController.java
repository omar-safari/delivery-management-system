package com.quickdoor.backend.controller;

import com.quickdoor.backend.model.Delivery;
import com.quickdoor.backend.model.User;
import com.quickdoor.backend.repository.DeliveryRepository;
import com.quickdoor.backend.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/deliveries")
@CrossOrigin(origins = "*")
public class DeliveryController {

    private final DeliveryRepository deliveryRepository;
    private final UserRepository userRepository;

    public DeliveryController(DeliveryRepository deliveryRepository, UserRepository userRepository) {
        this.deliveryRepository = deliveryRepository;
        this.userRepository = userRepository;
    }

    // GET all deliveries
    @GetMapping
    public List<Delivery> getAllDeliveries() {
        return deliveryRepository.findAll();
    }

    // POST create delivery
    @PostMapping
    public Delivery createDelivery(@RequestBody Delivery delivery) {
        return deliveryRepository.save(delivery);
    }

    // DELETE delivery
    @DeleteMapping("/{id}")
    public void deleteDelivery(@PathVariable Long id) {
        deliveryRepository.deleteById(id);
    }

    // UPDATE delivery
    @PutMapping("/{id}")
    public Delivery updateDelivery(@PathVariable Long id, @RequestBody Delivery deliveryDetails) {
        Delivery delivery = deliveryRepository.findById(id).orElseThrow();

        delivery.setDescription(deliveryDetails.getDescription());
        delivery.setAdresseDepart(deliveryDetails.getAdresseDepart());
        delivery.setAdresseArrivee(deliveryDetails.getAdresseArrivee());
        delivery.setStatus(deliveryDetails.getStatus());
        delivery.setClient(deliveryDetails.getClient());
        delivery.setLivreur(deliveryDetails.getLivreur());

        return deliveryRepository.save(delivery);
    }

    // Assign livreur to delivery
    @PutMapping("/{deliveryId}/assign/{livreurId}")
    public Delivery assignLivreur(@PathVariable Long deliveryId, @PathVariable Long livreurId) {
        Delivery delivery = deliveryRepository.findById(deliveryId).orElseThrow();
        User livreur = userRepository.findById(livreurId).orElseThrow();

        delivery.setLivreur(livreur);
        return deliveryRepository.save(delivery);
    }
}