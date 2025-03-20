package com.gubrynowicz.iuticket.service;

import com.gubrynowicz.iuticket.dto.TicketDTO;
import com.gubrynowicz.iuticket.model.Ticket;
import com.gubrynowicz.iuticket.model.User;
import com.gubrynowicz.iuticket.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserService userService;

    @Autowired
    public TicketService(
            TicketRepository ticketRepository,
            UserService userService) {
        this.ticketRepository = ticketRepository;
        this.userService = userService;
    }

    public List<TicketDTO> getTicketsForCurrentUser() {
        User currentUser = getCurrentUser();
        List<Ticket> tickets = ticketRepository.findByUserId(currentUser.getId());
        return tickets.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public Optional<TicketDTO> getTicketById(Long id) {
        Optional<Ticket> ticket = ticketRepository.findById(id);
        if (ticket.isPresent() && isTicketAccessible(ticket.get())) {
            return Optional.of(mapToDTO(ticket.get()));
        }
        return Optional.empty();
    }

    public TicketDTO createTicket(TicketDTO ticketDTO) {
        User currentUser = getCurrentUser();

        Ticket ticket = new Ticket();
        ticket.setTitle(ticketDTO.getTitle());
        ticket.setDescription(ticketDTO.getDescription());
        ticket.setDueDate(ticketDTO.getDueDate());
        ticket.setUser(currentUser);
        ticket.setCreatedAt(new Date());
        ticket.setUpdatedAt(new Date());


        Ticket savedTicket = ticketRepository.save(ticket);
        return mapToDTO(savedTicket);
    }

    public Optional<TicketDTO> updateTicket(Long id, TicketDTO ticketDTO) {
        Optional<Ticket> existingTicket = ticketRepository.findById(id);

        if (existingTicket.isPresent() && isTicketAccessible(existingTicket.get())) {
            Ticket ticket = existingTicket.get();

            // Only update fields if they are provided in the DTO
            if (ticketDTO.getTitle() != null) {
                ticket.setTitle(ticketDTO.getTitle());
            }

            if (ticketDTO.getDescription() != null) {
                ticket.setDescription(ticketDTO.getDescription());
            }

            if (ticketDTO.getStatus() != null) {
                ticket.setStatus(ticketDTO.getStatus());
            }

            if (ticketDTO.getDueDate() != null) {
                ticket.setDueDate(ticketDTO.getDueDate());
            }

            // Always update the updatedAt timestamp
            ticket.setUpdatedAt(new Date());

            return Optional.of(mapToDTO(ticketRepository.save(ticket)));
        }

        return Optional.empty();
    }

    public boolean deleteTicket(Long id) {
        Optional<Ticket> ticket = ticketRepository.findById(id);
        if (ticket.isPresent() && isTicketAccessible(ticket.get())) {
            ticketRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return userService.getCurrentUserEntity(authentication);
    }

    private boolean isTicketAccessible(Ticket ticket) {
        User currentUser = getCurrentUser();
        // Check if user is the owner of the ticket
        return ticket.getUser() != null && ticket.getUser().getId().equals(currentUser.getId());
    }

    private TicketDTO mapToDTO(Ticket ticket) {

        return new TicketDTO(
                ticket.getId(),
                ticket.getTitle(),
                ticket.getDescription(),
                ticket.getUser().getId(),
                ticket.getStatus(),
                ticket.getDueDate(),
                ticket.getCreatedAt(),
                ticket.getUpdatedAt()
        );
    }
}