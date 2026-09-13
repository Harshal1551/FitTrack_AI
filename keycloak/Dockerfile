FROM quay.io/keycloak/keycloak:26.3

ENV KC_HTTP_PORT=8080
ENV KC_HEALTH_ENABLED=true
ENV KC_HTTP_HOST=0.0.0.0

EXPOSE 8080

ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
CMD ["start-dev", "--http-port=8080", "--http-host=0.0.0.0"]