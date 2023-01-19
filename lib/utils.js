import { BigNumber, utils } from 'ethers'
import numeral from 'numeral'
import _ from 'lodash'
import moment from 'moment'

const remove_decimal = number => {
  if (typeof number === 'number') {
    number = number.toString()
  }

  if (number.includes('NaN')) {
    return number.replace(
      'NaN',
      '< 0.00000001',
    )
  }

  if (typeof number === 'string') {
    if (number.indexOf('.') > -1) {
      let decimal = number.substring(
        number.indexOf('.') + 1,
      )

      while (decimal.endsWith('0')) {
        decimal = decimal.substring(
          0,
          decimal.length - 1,
        )
      }

      if (
        number.substring(
          0,
          number.indexOf('.'),
        ).length >= 7 &&
        decimal.length > 2 &&
        !isNaN(`0.${decimal}`)
      ) {
        decimal = Number(`0.${decimal}`)
          .toFixed(2)
          .toString()

        if (decimal.indexOf('.') > -1) {
          decimal = decimal.substring(
            decimal.indexOf('.') + 1,
          )

          while (decimal.endsWith('0')) {
            decimal = decimal.substring(
              0,
              decimal.length - 1,
            )
          }
        }
      }

      return `${number.substring(
        0,
        number.indexOf('.'),
      )}${decimal ?
        '.' :
        ''
      }${decimal}`
    }

    return number
  }

  return ''
}

export const number_format = (
  number,
  format,
  is_exact,
) => {
  if (number === Infinity) {
    return number.toString()
  }

  let formatted_number =
    numeral(number)
      .format(
        format.includes('.000') &&
        Math.abs(
          Number(number)
        ) >= 1.01 ?
          format
            .substring(
              0,
              format.indexOf('.') +
              (is_exact ?
                7 :
                3
              )
            ) :
          format === '0,0' &&
          Number(number) < 1 ?
            '0,0.00' :
            format
      )

  if (
    [
      'NaN',
      'e+',
      'e-',
      't',
    ].findIndex(s =>
      formatted_number.includes(s)
    ) > -1
  ) {
    formatted_number = number.toString()

    const to_decimal = n => {
      const sign = Math.sign(n)

      if (/\d+\.?\d*e[\+\-]*\d+/i.test(n)) {
        const zero = '0'
        const parts =
          String(n)
            .toLowerCase()
            .split('e')

        const e = parts.pop()
        let l = Math.abs(e)
        const direction = e / l
        const coeff_array =
          parts[0]
            .split('.')

        if (direction === -1) {
          coeff_array[0] = Math.abs(coeff_array[0])

          n =
            `${zero}.${
              new Array(l)
                .join(zero)
            }${
              coeff_array
                .join('')
            }`
        }
        else {
          const dec = coeff_array[1]

          if (dec) {
            l = l - dec.length
          }

          n =
            `${
              coeff_array
                .join('')
            }${
              new Array(l + 1)
                .join(zero)
            }`
        }
      }

      return (
        sign < 0 ?
          -n :
          n
      )
    }

    if (formatted_number.includes('e-')) {
      formatted_number = to_decimal(number)
    }
    else if (formatted_number.includes('e+')) {
      const [
        n,
        e,
      ] = formatted_number
        .split('e+')

      if (Number(e) <= 72) {
        const fixed_decimals = 2

        let _number =
          `${
            parseInt(
              Number(
                Number(n)
                  .toFixed(fixed_decimals)
              ) *
              Math.pow(
                10,
                fixed_decimals,
              )
            )
          }${
            _.range(
              Number(e)
            )
            .map(i => '0')
            .join('')
          }`

        _number =
          Number(
            utils.formatUnits(
              BigNumber.from(
                _number
              ),
              16 + fixed_decimals,
            )
          )

        const _format =
          `0,0${
            _number >= 100000 ?
              '.00a' :
              _number >= 100 ?
                '' :
                _number >= 1 ?
                  '.00' :
                  '.000000'
          }`

        return (
          `${
            number_format(
              _number,
              _format,
            )
          }t`
        )
      }
      else {
        return (
          numeral(number)
            .format('0,0e+0')
        )
      }
    }
    else {
      return (
        numeral(number)
          .format(
            `0,0${
              number < 1 ?
                '.00' :
                ''
            }a`
          )
      )
    }
  }
  else if (
    typeof number === 'number' &&
    !format?.includes('a') &&
    Number(
      formatted_number
        .split(',')
        .join('')
    )
    .toString() !==
    remove_decimal(
      formatted_number
        .split(',')
        .join('')
    )
  ) {
    formatted_number = number.toString()
  }

  let string =
    remove_decimal(formatted_number) ||
    ''

  if (
    string
      .toLowerCase()
      .endsWith('t') &&
    string
      .split(',')
      .length > 1
  ) {
    string =
      numeral(number)
        .format('0,0e+0')
  }

  return string
}

export const number_to_fixed = (
  number,
  decimals = 18,
) => {
  if (typeof number !== 'string') {
    try {
      number =
        number
          .toString()
    } catch (error) {
      number = ''
    }
  }

  return (
    number
      .split('.')
      .map((s, i) =>
        i === 1 ?
          s
            .substring(
              0,
              decimals,
            ) :
          s
      )
      .join('.')
  )
}

const names = {
  btc: 'Bitcoin',
  eth: 'Ethereum',
}

export const capitalize = s =>
  typeof s !== 'string' ?
    '' :
    s
      .trim()
      .split(' ')
      .join('_')
      .split('-')
      .join('_')
      .split('_')
      .map(x => x.trim())
      .filter(x => x)
      .map(x =>
        `${
          x
            .substr(
              0,
              1,
            )
            .toUpperCase()
        }${
          x
            .substr(
              1,
            )
        }`
      )
      .join(' ')

export const name = (
  s,
  data,
) =>
  names[s] ?
    names[s] :
    data?.name &&
    data.id === s ?
      data.name :
      s &&
      s.length <= 3 ?
        s.toUpperCase() :
        capitalize(s)

export const ellipse = (
  string,
  length = 10,
  prefix = '',
) =>
  !string ?
    '' :
    string.length < (length * 2) + 3 ?
      string :
      `${
        string.startsWith(prefix) ?
          prefix :
          ''
      }${
        string
          .replace(
            prefix,
            '',
          )
          .slice(
            0,
            length,
          )
      }...${
        string
          .replace(
            prefix,
            '',
          )
          .slice(-length)
      }`

export const equals_ignore_case = (
  a,
  b,
) =>
  (
    !a &&
    !b
  ) ||
  a?.toLowerCase() === b?.toLowerCase()

export const to_json = s => {
  if (s) {
    if (typeof s === 'object')
      return s

    try {
      return JSON.parse(s)
    } catch (error) {}
  }

  return null
}

export const _total_time_string = (
  total_time,
  a,
  b,
) => {
  if (typeof total_time === 'number') {
    total_time = parseInt(total_time)
  }

  return total_time < 60 ?
    `${total_time || 0}s` :
    total_time < 60 * 60 ?
      `${Math.floor(total_time / 60)}m${
        total_time % 60 > 0 ?
          ` ${total_time % 60}s` :
          ''
      }` :
      total_time < 24 * 60 * 60 ?
        moment
          .utc(
            total_time * 1000
          )
          .format('HH:mm:ss') :
        a &
        b ?
          `${
            moment(b)
              .diff(
                moment(a),
                'days',
              )
          } day` :
          `${
            moment()
              .diff(
                moment()
                  .subtract(
                    total_time,
                    'seconds',
                  ),
                  'days',
              )
          } day`
}

export const total_time_string = (
  a,
  b,
) => {
  if (
    !(
      typeof a === 'number' && 
      typeof b === 'number'
    )
  ) {
    return null
  }

  a = a * 1000
  b = b * 1000

  return (
    _total_time_string(
      moment(b)
        .diff(
          moment(a),
          'seconds',
        ),
      a,
      b,
    )
  )
}

export const loader_color = theme =>
  theme === 'dark' ?
    'white' :
    '#3b82f6'

export const sleep = ms =>
  new Promise(resolve =>
    setTimeout(
      resolve,
      ms,
    )
  )

export const error_patterns =
  [
    '(',
    '[',
  ]