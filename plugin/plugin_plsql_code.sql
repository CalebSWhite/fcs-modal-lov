g_search_term       varchar2(32767);

g_item              apex_plugin.t_page_item;
g_plugin            apex_plugin.t_plugin;

e_invalid_value     exception;

------------------------------------------------------------------------------
-- procedure enquote_names
------------------------------------------------------------------------------
procedure enquote_names(
    p_return_col in out varchar2
  , p_display_col in out varchar2
) is
begin

  p_return_col := dbms_assert.enquote_name(p_return_col);
  p_display_col := dbms_assert.enquote_name(p_display_col);

end enquote_names;

------------------------------------------------------------------------------
-- function get_columns_from_query
------------------------------------------------------------------------------
function get_columns_from_query (
    p_query         in varchar2
  , p_min_columns   in number
  , p_max_columns   in number
  , p_bind_list     in apex_plugin_util.t_bind_list default apex_plugin_util.c_empty_bind_list
) return dbms_sql.desc_tab3
is

  l_sql_handler apex_plugin_util.t_sql_handler;

begin

  l_sql_handler := apex_plugin_util.get_sql_handler(
      p_sql_statement   => p_query
    , p_min_columns     => p_min_columns
    , p_max_columns     => p_max_columns
    , p_component_name  => null
    , p_bind_list       => p_bind_list
  );

  return l_sql_handler.column_list;

end get_columns_from_query;

----------------------------------------------------------
-- procedure print_json_from_sql
----------------------------------------------------------
procedure print_json_from_sql (
    p_query       in varchar2
  , p_display_col in varchar2
  , p_return_val  in varchar2
  , p_query_2     in varchar2 default null
) is

  -- table of columns from query
  l_col_tab   dbms_sql.desc_tab3;

  -- Result of query
  l_result    apex_plugin_util.t_column_value_list2;
  l_result_count number := 0;

  col_idx     number;
  row_idx     number;

  l_varchar2  varchar2(32767);
  l_number    number;
  l_boolean   boolean;

  l_bind_list apex_plugin_util.t_bind_list;
  l_bind      apex_plugin_util.t_bind;

begin

  apex_plugin_util.print_json_http_header;

  l_bind.name  := 'searchterm';
  l_bind.value := g_search_term;

  l_bind_list(1) := l_bind;

  -- Get column names first
  l_col_tab := get_columns_from_query(
      p_query       => p_query
    , p_min_columns => 2
    , p_max_columns => 20
    , p_bind_list   => l_bind_list
  );

  -- If only four columns (incl rownum & nextrow) and column names don't match standard, rename return & display (for shared component or static LOV)
  if l_col_tab.count = 4 then
    if l_col_tab(1).col_name = 'DISP' and l_col_tab(2).col_name = 'VAL' then
      l_col_tab(1).col_name := p_return_val;
      l_col_tab(2).col_name := p_display_col;
    end if;
  end if;

  -- Now execute query and get results
  -- Bind variables are supported
  l_result := apex_plugin_util.get_data2 (
      p_sql_statement     => p_query
    , p_min_columns       => 2
    , p_max_columns       => 20
    , p_component_name    => null
    , p_bind_list         => l_bind_list
  );

  l_result_count := l_result(1).value_list.count;

  -- pkg_log.write (log_code__p      => 'ZC_MODAL_LOV',
  --               log_text__p      => 'Result Count : '||l_result_count);

  if l_result_count != 1
  then l_result := apex_plugin_util.get_data2 (
      p_sql_statement     => p_query_2
    , p_min_columns       => 2
    , p_max_columns       => 20
    , p_component_name    => null
    , p_bind_list         => l_bind_list
    );

    l_result_count := l_result(1).value_list.count;

    -- pkg_log.write (log_code__p      => 'ZC_MODAL_LOV',
    --                 log_text__p      => 'Result Count 2 : '||l_result_count);
  end if;

  apex_json.open_object();

  apex_json.open_array('row');

  -- Finally, make a JSON object from the result
  -- Loop trough all rows

  for row_idx in 1..l_result(1).value_list.count loop

    apex_json.open_object();

    -- Loop trough columns per row
    for col_idx in 1..l_col_tab.count loop

      -- Name value pair of column name and value
      case l_result(col_idx).data_type
        when apex_plugin_util.c_data_type_varchar2 then
          apex_json.write(l_col_tab(col_idx).col_name, l_result(col_idx).value_list(row_idx).varchar2_value, true);
          -- pkg_log.write (log_code__p      => 'ZC_MODAL_LOV',
          --                log_text__p      => l_col_tab(col_idx).col_name||' : '||l_result(col_idx).value_list(row_idx).varchar2_value);
        when apex_plugin_util.c_data_type_number then
          apex_json.write(l_col_tab(col_idx).col_name, l_result(col_idx).value_list(row_idx).number_value, true);
          -- pkg_log.write (log_code__p      => 'ZC_MODAL_LOV',
          --                log_text__p      => l_col_tab(col_idx).col_name||' : '||l_result(col_idx).value_list(row_idx).number_value);
        when apex_plugin_util.c_data_type_date then
          apex_json.write(l_col_tab(col_idx).col_name, l_result(col_idx).value_list(row_idx).date_value, true);
           -- pkg_log.write (log_code__p      => 'ZC_MODAL_LOV',
           --               log_text__p      => l_col_tab(col_idx).col_name||' : '||l_result(col_idx).value_list(row_idx).date_value);
      end case;
      -- pkg_log.write (log_code__p      => 'ZC_MODAL_LOV',
      --                log_text__p      => l_where);

    end loop;

    apex_json.close_object();

  end loop;

  apex_json.close_all();

end print_json_from_sql;

----------------------------------------------------------
-- function get_lov_query
----------------------------------------------------------
function get_lov_query (
    p_lookup_query  varchar2
  , p_return_col    varchar2
  , p_display_col   varchar2
) return varchar2
is

  -- table of columns from query
  l_col_tab   dbms_sql.desc_tab3;

  l_query     varchar2(32767);

begin

  -- Get column names first
  l_col_tab := get_columns_from_query(
      p_query       => p_lookup_query
    , p_min_columns => 2
    , p_max_columns => 20
  );

  -- If only two columns and column names don't match standard, rename return & display (for shared component or static LOV)
  if l_col_tab.count = 2 then
    if l_col_tab(1).col_name = 'DISP' and l_col_tab(2).col_name = 'VAL' then
      l_query := 'select DISP, VAL from (' || trim(trailing ';' from p_lookup_query) || ')';
    end if;
  end if;

  if l_query is null then
    l_query := 'select ' || p_display_col || ', ' || p_return_col || ' from (' || trim(trailing ';' from p_lookup_query) || ')';
  end if;

  return l_query;

end get_lov_query;

----------------------------------------------------------
-- function get_display_value
----------------------------------------------------------
function get_display_value (
    p_lookup_query  varchar2
  , p_return_col    varchar2
  , p_display_col   varchar2
  , p_return_val    varchar2
) return varchar2
is

  l_result    apex_plugin_util.t_column_value_list;

  l_query     varchar2(32767);

begin

  if p_return_val is null then
    return null;
  end if;

  l_query := get_lov_query (
      p_lookup_query  => p_lookup_query
    , p_return_col    => p_return_col
    , p_display_col   => p_display_col
  );

  l_result := apex_plugin_util.get_data (
      p_sql_statement     => l_query
    , p_min_columns       => 2
    , p_max_columns       => 2
    , p_component_name    => null
    , p_search_type       => apex_plugin_util.c_search_lookup
    , p_search_column_no  => 2
    , p_search_string     => p_return_val
  );

  -- THe result is always the first column and first row
  return l_result(1)(1);

exception
  when no_data_found then

    raise e_invalid_value;

end get_display_value;

----------------------------------------------------------
-- procedure print_lov_data
----------------------------------------------------------
procedure print_lov_data(
  p_return_col  in varchar2
, p_display_col in varchar2
)
is

  -- Ajax parameters
  l_search_term     varchar2(32767) := apex_application.g_x02;
  l_first_rownum    number := nvl(to_number(apex_application.g_x03),1);

  -- Number of rows to return
  l_rows_per_page   apex_application_page_items.attribute_02%type := nvl(g_item.attribute_02, 15);

  -- Query for lookup LOV
  l_lookup_query    varchar2(32767);
  l_generic_lookup_query varchar2(32767) := null;
  l_lookup_count    varchar2(32767);
  l_generic_lookup_count varchar2(32767) := null;
  l_query_count     number := 0;

  -- table of columns for lookup query
  l_col_tab         dbms_sql.desc_tab3;

  l_cols_where      varchar2(32767);
  l_generic_cols_where varchar2(32767) := null;
  l_cols_select     varchar2(32767);

  l_last_rownum     number;

  l_bind_list apex_plugin_util.t_bind_list;
  l_bind      apex_plugin_util.t_bind;

  ----------------------------------------------------------------------------
  -- function concat_columns
  ----------------------------------------------------------------------------
  function concat_columns (
    p_col_tab     in dbms_sql.desc_tab3
  , p_separator   in varchar2
  , p_add_quotes  in boolean default false
  ) return varchar2 is

    l_cols_concat     varchar2(32767);

    l_col             varchar2(128);

  begin

    for idx in 1..p_col_tab.count loop

      l_col := p_col_tab(idx).col_name;

      if p_add_quotes then
        l_col := '"' || l_col || '"';
      end if;

      l_cols_concat := l_cols_concat || l_col;

      if idx < p_col_tab.count then
        l_cols_concat := l_cols_concat || p_separator;
      end if;

    end loop;

    return l_cols_concat;

  end concat_columns;

  ----------------------------------------------------------------------------
  -- function get_where_clause
  ----------------------------------------------------------------------------
  function get_where_clause (
    p_col_tab     in dbms_sql.desc_tab3
  , p_return_col  in varchar2
  , p_display_col in varchar2
  ) return varchar2 is

    l_where     varchar2(32767);
    l_where_alt varchar2(4000) := null;

  begin
    -- pkg_log.write (log_code__p      => 'ZC_MODAL_LOV',
    --                log_text__p      => 'get_where_clause');

    for idx in 1..p_col_tab.count loop

      -- Exlude return column
      -- Include only Return Column
      if (dbms_assert.enquote_name(p_col_tab(idx).col_name) = p_return_col) then
        l_where := 'regexp_instr(upper(' ||  '"' || p_col_tab(idx).col_name  || '"' || '), :searchterm) > 0 or :searchterm is null';
        l_where_alt := 'upper(' ||  '"' || p_col_tab(idx).col_name  || '"' || ') = :searchterm or :searchterm is null';
        -- pkg_log.write (log_code__p      => 'ZC_MODAL_LOV',
        --           log_text__p      => l_where||' : '||l_where_alt);
        return l_where_alt;
        -- continue;
      end if;

      -- Exclude display column if more than 2 columns (display column is hidden if extra columns are in the lov)
      if p_col_tab.count > 2 and dbms_assert.enquote_name(p_col_tab(idx).col_name) = p_display_col then
        continue;
      end if;

      if l_where is not null then
        l_where := l_where || '||';
      end if;

      l_where := l_where || '"' || p_col_tab(idx).col_name || '"';

    end loop;

    l_where := 'regexp_instr(upper(' || l_where || '), :searchterm) > 0 or :searchterm is null';
    -- pkg_log.write (log_code__p      => 'ZC_MODAL_LOV',
    --                log_text__p      => l_where);

    return l_where;

  end get_where_clause;

  ----------------------------------------------------------------------------
  -- function get_generic_where_clause
  ----------------------------------------------------------------------------
  function get_generic_where_clause (
    p_col_tab     in dbms_sql.desc_tab3
  , p_return_col  in varchar2
  , p_display_col in varchar2
  ) return varchar2 is
    l_where     varchar2(32767) := null;
  begin
    for idx in 1..p_col_tab.count loop

      -- Exlude return column
      if (dbms_assert.enquote_name(p_col_tab(idx).col_name) = p_return_col) then
        continue;
      end if;

      -- Exclude display column if more than 2 columns (display column is hidden if extra columns are in the lov)
      if p_col_tab.count > 2 and dbms_assert.enquote_name(p_col_tab(idx).col_name) = p_display_col then
        continue;
      end if;

      if l_where is not null then
        l_where := l_where || '||';
      end if;
      l_where := l_where || '"' || p_col_tab(idx).col_name || '"';
    end loop;

    l_where := 'regexp_instr(upper(' || l_where || '), :searchterm) > 0 or :searchterm is null';
    return l_where;
  end get_generic_where_clause;

begin

    /*

      Get data op using the items LOV query definition
      By default, max 15 rows are retrieved, this number can be change in the plugin settings

    */
    g_search_term := upper(l_search_term);

    l_lookup_query := g_item.lov_definition;
    l_lookup_count := g_item.lov_definition;  -- select count(*) form query
    l_generic_lookup_query := g_item.lov_definition;
    l_generic_lookup_count := g_item.lov_definition;  -- select count(*) form query

    -- pkg_log.write(log_code__p => 'ZC_MODAL_LOV',
    --                  log_text__p => g_item.lov_definition);

    -- Get column names first, they are needed to write an additional where clause for the search text
    l_col_tab := get_columns_from_query(
        p_query       => l_lookup_query
      , p_min_columns => 2
      , p_max_columns => 20
    );

    -- Use column names to create the WHERE clause
    l_cols_where := get_where_clause(l_col_tab, p_return_col, p_display_col);
    l_generic_cols_where := get_generic_where_clause(l_col_tab, p_return_col, p_display_col);

    -- pkg_log.write(log_code__p => 'ZC_MODAL_LOV',
    --                  log_text__p => l_cols_where);

    -- pkg_log.write(log_code__p => 'ZC_MODAL_LOV_GENERIC',
    --                  log_text__p => l_generic_cols_where);

    -- What is the last row to retrieve?
    l_last_rownum := (l_first_rownum + l_rows_per_page  - 1);

    -- Wrap inside a subquery to limit the number of rows
    -- Also add the created WHERE clause
    -- With the lead function we can examine if there is a next set of records or not
    l_lookup_query :=
        'select *'
      || '  from (select src.*'
      || '             , case when rownum### = ' || l_last_rownum || ' then ' -- Find the second-last record
      || '                 lead(rownum) over (partition by null order by null)' -- Check if a next record exists and sort on fist column
      || '               end nextrow###'
      || '          from (select src.*'
      || '                     , row_number() over (partition by null order by null) rownum###' -- Add a sequential rownumber
      || '                  from (' || l_lookup_query || ') src'
      || '                 where exists ( select 1 from dual where ' || l_cols_where || ')) src'
      || '         where rownum### between ' || l_first_rownum || ' and ' || (l_last_rownum + 1) || ')' -- Temporarily add  1 record to see if a next record exists (lead functie)
      || ' where rownum### between ' || l_first_rownum || ' and ' || l_last_rownum; -- Haal het extra record er weer af

    l_lookup_count :=
        'select count(*) from (select *'
      || '  from (select src.*'
      || '             , case when rownum### = ' || l_last_rownum || ' then ' -- Find the second-last record
      || '                 lead(rownum) over (partition by null order by null)' -- Check if a next record exists and sort on fist column
      || '               end nextrow###'
      || '          from (select src.*'
      || '                     , row_number() over (partition by null order by null) rownum###' -- Add a sequential rownumber
      || '                  from (' || l_lookup_count || ') src'
      || '                 where exists ( select 1 from dual where ' || l_cols_where || ')) src'
      || '         where rownum### between ' || l_first_rownum || ' and ' || (l_last_rownum + 1) || ')' -- Temporarily add  1 record to see if a next record exists (lead functie)
      || ' where rownum### between ' || l_first_rownum || ' and ' || l_last_rownum||' )'; -- Haal het extra record er weer af

    l_generic_lookup_query :=
        'select *'
      || '  from (select src.*'
      || '             , case when rownum### = ' || l_last_rownum || ' then ' -- Find the second-last record
      || '                 lead(rownum) over (partition by null order by null)' -- Check if a next record exists and sort on fist column
      || '               end nextrow###'
      || '          from (select src.*'
      || '                     , row_number() over (partition by null order by null) rownum###' -- Add a sequential rownumber
      || '                  from (' || l_generic_lookup_query || ') src'
      || '                 where exists ( select 1 from dual where ' || l_generic_cols_where || ')) src'
      || '         where rownum### between ' || l_first_rownum || ' and ' || (l_last_rownum + 1) || ')' -- Temporarily add  1 record to see if a next record exists (lead functie)
      || ' where rownum### between ' || l_first_rownum || ' and ' || l_last_rownum; -- Haal het extra record er weer af
    l_generic_lookup_count :=
        'select count(*) from (select *'
      || '  from (select src.*'
      || '             , case when rownum### = ' || l_last_rownum || ' then ' -- Find the second-last record
      || '                 lead(rownum) over (partition by null order by null)' -- Check if a next record exists and sort on fist column
      || '               end nextrow###'
      || '          from (select src.*'
      || '                     , row_number() over (partition by null order by null) rownum###' -- Add a sequential rownumber
      || '                  from (' || l_generic_lookup_count || ') src'
      || '                 where exists ( select 1 from dual where ' || l_generic_cols_where || ')) src'
      || '         where rownum### between ' || l_first_rownum || ' and ' || (l_last_rownum + 1) || ')' -- Temporarily add  1 record to see if a next record exists (lead functie)
      || ' where rownum### between ' || l_first_rownum || ' and ' || l_last_rownum||' )'; -- Haal het extra record er weer af

    -- pkg_log.write(log_code__p => 'ZC_MODAL_LOV',
    --                  log_text__p => l_lookup_query);

    -- pkg_log.write(log_code__p => 'ZC_MODAL_LOV_GENERIC',
    --                  log_text__p => l_generic_lookup_query);

    -- pkg_log.write(log_code__p => 'ZC_MODAL_LOV',
    --                  log_text__p => l_lookup_count);

    -- pkg_log.write(log_code__p => 'ZC_MODAL_LOV_GENERIC',
    --                  log_text__p => l_generic_lookup_count);

    print_json_from_sql(l_lookup_query, p_return_col, p_display_col, l_generic_lookup_query);

    -- execute immediate l_lookup_count into l_query_count using g_search_term, g_search_term;
    -- if l_query_count = 1
    -- then print_json_from_sql(l_lookup_query, p_return_col, p_display_col);
    -- else print_json_from_sql(l_generic_lookup_query, p_return_col, p_display_col);
    -- end if;


end print_lov_data;

----------------------------------------------------------
-- procedure print_value
----------------------------------------------------------
procedure print_value
is

  l_display         varchar2(32767);

  -- Ajax parameters
  l_return_value    varchar2(32767) := apex_application.g_x02;

  -- The columns for getting the value
  l_return_col      apex_application_page_items.attribute_03%type := g_item.attribute_03;
  l_display_col     apex_application_page_items.attribute_04%type := g_item.attribute_04;

begin

  -- Get display value based upon value of return column (p_value)
  begin
    l_display := get_display_value(
        p_lookup_query  => g_item.lov_definition
      , p_return_col    => l_return_col
      , p_display_col   => l_display_col
      , p_return_val    => l_return_value
    );
  exception
    when e_invalid_value then
      l_display := case when g_item.lov_display_extra then l_return_value else null end;
  end;

  apex_plugin_util.print_json_http_header;

  apex_json.open_object();

  apex_json.write('returnValue', l_return_value);
  apex_json.write('displayValue', l_display);

  apex_json.close_object();

end print_value;

----------------------------------------------------------
-- function render
----------------------------------------------------------
procedure render (
  p_item   in apex_plugin.t_item,
  p_plugin in apex_plugin.t_plugin,
  p_param  in apex_plugin.t_item_render_param,
  p_result in out nocopy apex_plugin.t_item_render_result
)
is

  type t_item_render_param is record (
    value_set_by_controller boolean default false,
    value                   varchar2(32767),
    is_readonly             boolean default false,
    is_printer_friendly     boolean default false
  );

  l_return              apex_plugin.t_page_item_render_result;

  -- The width (px) of the LOV modal
  l_width               apex_application_page_items.attribute_01%type := to_number(p_item.attribute_01);

  -- Number of rows to return
  l_rows_per_page       apex_application_page_items.attribute_02%type := nvl(p_item.attribute_02, 15);

  -- The column with the return value
  l_return_col          apex_application_page_items.attribute_03%type := p_item.attribute_03;

  -- The column with the display value
  l_display_col         apex_application_page_items.attribute_04%type := p_item.attribute_04;

  -- Should column headers be shown in the LOV?
  l_show_headers        boolean := p_item.attribute_05 = 'Y';

  -- Title of the modal LOV
  l_title               apex_application_page_items.attribute_06%type := p_item.attribute_06;

  -- Error message on validation
  l_validation_err      apex_application_page_items.attribute_07%type := p_item.attribute_07;

  -- Search placeholder
  l_search_placeholder  apex_application_page_items.attribute_08%type := p_item.attribute_08;

  -- No data found message
  l_no_data_found       apex_application_page_items.attribute_09%type := p_item.attribute_09;

  -- Allow rows to grow?
  l_multiline_rows      boolean := p_item.attribute_10 = 'Y';

  -- Input text case. U for uppercase, L for lowercase, N for no change
  l_text_case           apex_application_page_items.attribute_11%type := p_item.attribute_11;

  -- Additional outputs.
  l_additional_outputs  apex_application_page_items.attribute_12%type := p_item.attribute_12;

  -- Search first column only.
  l_search_first_col     boolean := p_item.attribute_13 = 'Y';

  -- Next field on enter.
  l_next_on_enter       boolean := p_item.attribute_14 = 'Y';

  -- Value for the display item
  l_display             varchar2(32767);

  l_html                varchar2(32767);

  l_ignore_change       varchar2(15);

  l_name                varchar2(32767);

begin

  enquote_names(
    p_return_col  => l_return_col
  , p_display_col => l_display_col
  );

  -- Get display value based on return item (p_value)
  begin
    l_display := get_display_value(
        p_lookup_query  => p_item.lov_definition
      , p_return_col    => l_return_col
      , p_display_col   => l_display_col
      , p_return_val    => p_param.value
    );
  exception
    when e_invalid_value then
      l_display := case when p_item.lov_display_extra then p_param.value else null end;
  end;

  apex_plugin_util.print_hidden_if_readonly (
    p_item_name           => p_item.name
  , p_value               => p_param.value
  , p_is_readonly         => p_param.is_readonly
  , p_is_printer_friendly => p_param.is_printer_friendly
  );

  --
  -- printer friendly display
  if p_param.is_printer_friendly then
    apex_plugin_util.print_display_only (
        p_item_name        => p_item.name
      , p_display_value    => l_display
      , p_show_line_breaks => false
      , p_escape           => p_item.escape_output
      , p_attributes       => p_item.element_attributes
    );

  -- normal display
  else

    if p_item.ignore_change then
      l_ignore_change := 'js-ignoreChange';
    end if;

    l_name := apex_plugin.get_input_name_for_page_item(p_is_multi_value=>false);

    -- Input item
    sys.htp.prn('<div class="fcs-modal-lov-container" tabindex="-1">');
    sys.htp.prn('<input');
    sys.htp.prn(' type="text"');
    sys.htp.prn(' id="' || p_item.name || '"');
    sys.htp.prn(' name="' || l_name || '"');
    sys.htp.prn(' class="apex-item-text fcs-modal-lov modal-lov-item '||l_ignore_change|| ' ' || p_item.element_css_classes);
    sys.htp.prn(case when l_text_case = 'U' then ' u-textUpper' when l_text_case = 'L' then ' u-textLower' else null end);
    sys.htp.prn(case when p_param.is_readonly then ' fcs-modal-lov-readonly-item' else null end);
    sys.htp.prn('"');
    sys.htp.prn(case when p_item.is_required then ' required' else null end);
    sys.htp.prn(' maxlength="' || p_item.element_max_length || '"');
    sys.htp.prn(' size="' || p_item.element_width || '"');
    sys.htp.prn(' autocomplete="off"');
    sys.htp.prn(' placeholder="' || p_item.placeholder || '"');
   -- sys.htp.prn(' data-valid-message="' || l_validation_err || '"');
    sys.htp.prn(' value="');
    apex_plugin_util.print_escaped_value(l_display);
    sys.htp.prn('"');
    sys.htp.prn(' data-return-value="');
    apex_plugin_util.print_escaped_value(p_param.value);
    sys.htp.prn('"');
    sys.htp.prn(case when p_param.is_readonly then ' readonly="readonly" tabindex="-1" ' else null end);
    sys.htp.prn('/>');

    if (not p_param.is_readonly) then
      -- Search icon
      sys.htp.prn('<span class="fcs-search-clear fa fa-times-circle-o"></span>');

      -- Search button
      sys.htp.prn('<button type="button" id="' || p_item.name || '_BUTTON" class="a-Button fcs-modal-lov-button a-Button--popupLOV" tabIndex="-1"><span class="fa fa-search" aria-hidden="true"></span></button>');

      -- Initialize rest of the plugin with javascript
      apex_javascript.add_onload_code (
        p_code => '$("#' ||p_item.name || '").modalLov({'
                    || 'id: "' || p_item.name || '_MODAL",'
                    || 'title: "' || l_title || '",'
                    || 'itemLabel: "' || p_item.plain_label || '",'
                    || 'itemName: "' ||p_item.name || '",'
                    || 'searchField: "' ||p_item.name || '_SEARCH",'
                    || 'searchButton: "' || p_item.name || '_BUTTON",'
                    || 'ajaxIdentifier: "' || apex_plugin.get_ajax_identifier || '",'
                    || 'showHeaders: ' || case when l_show_headers then 'true' else 'false' end || ','
                    || 'returnCol: ' || l_return_col || ','
                    || 'displayCol: ' || l_display_col || ','
                    || 'validationError: "' || l_validation_err || '",'
                    || 'searchPlaceholder: "' || l_search_placeholder || '",'
                    || 'cascadingItems: "' || apex_plugin_util.item_names_to_jquery(p_item_names => p_item.lov_cascade_parent_items, p_item => p_item) || '",'
                    || 'modalWidth: ' || l_width || ','
                    || 'noDataFound: "' || l_no_data_found || '",'
                    || 'allowMultilineRows: ' || case l_multiline_rows when true then 'true' else 'false' end  || ','
                    || 'rowCount: ' || l_rows_per_page || ','
                    || 'pageItemsToSubmit: "' || apex_plugin_util.item_names_to_jquery(p_item_names => p_item.ajax_items_to_submit, p_item => p_item) || '",'
                    || 'previousLabel: "' || wwv_flow_lang.system_message('PAGINATION.PREVIOUS') || '",'
                    || 'nextLabel: "' || wwv_flow_lang.system_message('PAGINATION.NEXT') || '",'
                    || 'textCase: "' || l_text_case || '",'
                    || 'additionalOutputsStr: "' || l_additional_outputs || '",'
                    || 'searchFirstColOnly: ' || case when l_search_first_col then 'true' else 'false' end || ','
                    || 'nextOnEnter: ' || case when l_next_on_enter then 'true' else 'false' end || ','
                ||'});'
      );
    end if;

    sys.htp.prn('</div>');

  end if;

end render;

--------------------------------------------------------------------------------
-- function ajax
--------------------------------------------------------------------------------
procedure ajax(
  p_item   in            apex_plugin.t_item,
  p_plugin in            apex_plugin.t_plugin,
  p_param  in            apex_plugin.t_item_ajax_param,
  p_result in out nocopy apex_plugin.t_item_ajax_result )
is

  -- Ajax parameters
  l_action          varchar2(32767) := apex_application.g_x01;

  -- The column with the return value
  l_return_col          apex_application_page_items.attribute_03%type := p_item.attribute_03;
  l_display_col         apex_application_page_items.attribute_04%type := p_item.attribute_04;

begin

  g_item := p_item;
  g_plugin := p_plugin;

  enquote_names(
    p_return_col  => l_return_col
  , p_display_col => l_display_col
  );

  -- What should we do
  if l_action = 'GET_DATA' then

    print_lov_data(
      p_return_col  => l_return_col
    , p_display_col => l_display_col
    );

  elsif l_action = 'GET_VALUE' then

    print_value;

  end if;

end ajax;

procedure validation (
  p_item   in           apex_plugin.t_item
, p_plugin in            apex_plugin.t_plugin
, p_param  in            apex_plugin.t_item_validation_param
, p_result in out nocopy apex_plugin.t_item_validation_result
) is

  l_display             varchar2(32767);
  l_validation_err      apex_application_page_items.attribute_07%type := p_item.attribute_07;
  l_return_col          apex_application_page_items.attribute_03%type := p_item.attribute_03;
  l_display_col         apex_application_page_items.attribute_04%type := p_item.attribute_04;
begin

  g_item := p_item;

  begin
    l_display := get_display_value(
        p_lookup_query  => g_item.lov_definition
      , p_return_col    => l_return_col
      , p_display_col   => l_display_col
      , p_return_val    => p_param.value
    );
  exception
    when e_invalid_value then
      p_result.message := l_validation_err;
      p_result.display_location := apex_plugin.c_inline_with_field_and_notif;
      p_result.page_item_name := p_item.name;
  end;
end validation;

procedure meta_data (
    p_item   in            apex_plugin.t_item,
    p_plugin in            apex_plugin.t_plugin,
    p_param  in            apex_plugin.t_item_meta_data_param,
    p_result in out nocopy apex_plugin.t_item_meta_data_result )
is

  l_query     varchar2(32767);

  -- The column with the return value
  l_return_col          apex_application_page_items.attribute_03%type := p_item.attribute_03;
  l_display_col         apex_application_page_items.attribute_04%type := p_item.attribute_04;

begin

  g_item := p_item;

  enquote_names(
    p_return_col  => l_return_col
  , p_display_col => l_display_col
  );

  l_query := get_lov_query (
      p_lookup_query  => g_item.lov_definition
    , p_return_col    => l_return_col
    , p_display_col   => l_display_col
  );

  p_result.display_lov_definition := l_query;

end meta_data;
