Feature: test script for 'encomenda'

  Background:
    * url 'http://localhost:5000/encomenda'

  
  Scenario: create a encomenda
    * def encomenda =
    """
    {
      "origem": "SRS",
      "destino": "PA",
      "peso": "75kg",
      "data": "01/01/1970",
    }
    """

    Given path 'inserir'
    And request encomenda
    When method post
    Then status 200

  Scenario: retrieve all inserted encomendas
    Given path 'listar'
    When method get
    Then status 200
    And match each $ contains { id : '#number', origem : '#string', destino : '#string', peso : '#string', data : '#string' }

  Scenario: update a specific encomend (must retrieve id first)

    * def getRandOrigem =
    """
    function() {
    return java.util.UUID.randomUUID() + '';
    } 
    """

    Given path 'listar'
    When method get
    Then status 200
    * def encomendaOriginal = response[0]

    * def encomendaModificado =
    """
    {
      "id": '#(encomendaOriginal.id)',
      "origem": "#(getRandOrigem())",
      "destino": '#(encomendaOriginal.destino)',
      "peso": '#(encomendaOriginal.peso)'
    }
    """

    Given path 'atualizar'
    And request encomendaModificado
    When method put
    Then status 200
    And match response.affectedRows == 1

    Given path 'listar'
    When method get
    Then status 200
    * def encomendaDepois = response[0]
    And match encomendaDepois.id == encomendaOriginal.id
    And match encomendaDepois.origem == encomendaModificado.origem
    And match encomendaDepois.destino == encomendaModificado.destino
    And match encomendaDepois.peso == encomendaModificado.peso

  Scenario: delete a specific encomenda (must retrieve id first)

    Given path 'listar'
    When method get
    Then status 200
    * def encomenda =
    """
    {
      "id": '#(response[0].id)'
    }
    """

    Given path 'excluir'
    And request encomenda
    When method delete
    Then status 200
    And match response.affectedRows == 1

    Given path 'excluir'
    And request encomenda
    When method delete
    Then status 200
    And match response.affectedRows == 0
