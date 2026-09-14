FROM quay.io/keycloak/keycloak:26.3

ENV KC_HTTP_PORT=10000
ENV KC_HTTP_HOST=0.0.0.0
ENV KC_HEALTH_ENABLED=true

RUN /opt/keycloak/bin/kc.sh build

EXPOSE 10000

ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
CMD ["start", "--optimized", "--http-port=10000", "--http-host=0.0.0.0"]