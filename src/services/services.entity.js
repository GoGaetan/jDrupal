/**
 * Performs an entity index.
 * @param {String} entity_type
 * @param {String} query
 * @param {Object} options
 */
function entity_index(entity_type, query, options) {
  try {
    var query_string;
    if (typeof query === 'object') {
      query_string = entity_index_build_query_string(query);
    }
    else if (typeof query === 'string') {
      query_string = query;
    }
    if (query_string) { query_string = '&' + query_string; }
    else { query_string = ''; }
    jDrupal.services.call({
        method: 'GET',
        path: entity_type + '.json' + query_string,
        service: options.service,
        resource: options.resource,
        entity_type: entity_type,
        success: function(result) {
          try {
            if (options.success) { options.success(result); }
          }
          catch (error) { console.log('entity_index - success - ' + error); }
        },
        error: function(xhr, status, message) {
          try {
            if (options.error) { options.error(xhr, status, message); }
          }
          catch (error) { console.log('entity_index - error - ' + error); }
        }
    });
  }
  catch (error) { console.log('entity_index - ' + error); }
}
/**
 * Builds a query string from a query object for an entity index resource.
 * @param {Object} query
 * @return {String}
 */
function entity_index_build_query_string(query) {
  try {
    var result = '';
    if (!query) { return result; }
    if (query.fields) { // array
      var fields = '';
      for (var i = 0; i < query.fields.length; i++) {
        fields += encodeURIComponent(query.fields[i]) + ',';
      }
      if (fields != '') {
        fields = 'fields=' + fields.substring(0, fields.length - 1);
        result += fields + '&';
      }
    }
    if (query.parameters) { // object
      var parameters = '';
      for (var parameter in query.parameters) {
          if (query.parameters.hasOwnProperty(parameter)) {
            var key = encodeURIComponent(parameter);
            var value = encodeURIComponent(query.parameters[parameter]);
            parameters += 'parameters[' + key + ']=' + value + '&';
          }
      }
      if (parameters != '') {
        parameters = parameters.substring(0, parameters.length - 1);
        result += parameters + '&';
      }
    }
    if (typeof query.page !== 'undefined') { // int
      result += 'page=' + encodeURIComponent(query.page) + '&';
    }
    if (typeof query.page_size !== 'undefined') { // int
      result += 'page_size=' + encodeURIComponent(query.page_size) + '&';
    }
    return result.substring(0, result.length - 1);
  }
  catch (error) { console.log('entity_index_build_query_string - ' + error); }
}

/**
 * Wraps an entity in a JSON object, keyed by its type.
 * @param {String} entity_type
 * @param {Object} entity
 * @return {String}
 */
function _entity_wrap(entity_type, entity) {
  try {
    // We don't wrap taxonomy, users or commerce entities.
    var entity_wrapper = {};
    if (entity_type == 'taxonomy_term' ||
      entity_type == 'taxonomy_vocabulary' ||
      entity_type == 'user' || entity_type.indexOf('commerce') != -1) {
      entity_wrapper = entity;
    }
    else { entity_wrapper[entity_type] = entity; }
    return entity_wrapper;
  }
  catch (error) { console.log('_entity_wrap - ' + error); }
}

