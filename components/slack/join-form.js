import {
  Box,
  Card,
  Grid,
  Input,
  Label,
  Link,
  Select,
  Text,
  Textarea
} from 'theme-ui'
import { useRouter } from 'next/router'
import useForm from '../../lib/use-form'
import Submit from '../submit'
import { getCookie, hasCookie } from 'cookies-next'
import { useEffect, useState } from 'react'

let allMonths = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

const JoinForm = ({ sx = {} }) => {
  const [isAdult, setIsAdult] = useState(false)

  const [month, setMonth] = useState('')
  const [day, setDay] = useState('')
  const [year, setYear] = useState('')

  console.log(month, day, year)

  const router = useRouter()

  useEffect(() => {
    if (month === '' || day === '' || year === '') {
      setIsAdult(false)
    }

    const birthday = new Date(year, month - 1, day)
    const age = new Date().getFullYear() - birthday.getFullYear()

    console.log(age, ' years old')

    if (age >= 18) {
      setIsAdult(true)
    }
    console.log(isAdult, 'is adult?')
  }, [day, month, year])

  const createNums = (start, end) => {
    let nums = []
    for (let num = start; num <= end; num++) {
      nums.push(num)
    }

    return nums
  }

  const years = createNums(1925, new Date().getFullYear())
  const months = createNums(1, 12)
  const days = createNums(1, 31)

  const useWaitlist = process.env.NEXT_PUBLIC_OPEN !== 'true'

  const { status, formProps, useField } = useForm('/api/join/', null, {
    clearOnSubmit: 60000,
    method: 'POST',
    initData: hasCookie('continent')
      ? {
          continent: getCookie('continent'),
          reason: router.query.reason,
          event: router.query.event,
          isAdult
        }
      : { reason: router.query.reason, event: router.query.event }
  })

  const eventReferrer = useField('event').value

  return (
    <Card sx={{ maxWidth: 'narrow', mx: 'auto', label: { mb: 3 }, ...sx }}>
      <form {...formProps}>
        {eventReferrer && (
          <Box
            sx={{
              bg: 'purple',
              color: 'white',
              p: 2,
              mb: 3,
              borderRadius: 5,
              textAlign: 'center'
            }}
          >
            <Text variant="headline" sx={{ fontSize: 3 }}>
              {eventReferrer === 'onboard'
                ? "We can't wait to see your PCB!"
                : `We can't wait to see you at ${eventReferrer}!`}
            </Text>

            <br />
            <Text variant="subtitle" sx={{ fontSize: 2 }}>
              <i> In the meantime, we'll be hanging around in the Slack </i>
            </Text>
          </Box>
        )}
        <Grid columns={[1, 2]} gap={1} sx={{ columnGap: 2 }}>
          <Label>
            Full name
            <Input
              {...useField('name')}
              placeholder="Fiona Hackworth"
              required
              id="joiner_full_name"
            />
          </Label>
          <Label sx={{ width: '100%' }}>
            Email address
            <Input
              {...useField('email')}
              placeholder="fiona@hackclub.com"
              required
            />
          </Label>
        </Grid>
        <Grid columns={[1, 3]} gap={1} sx={{ columnGap: 2 }}>
          <Label>
            Birthday
            <Select
              required
              onChange={e => setMonth(e.target.value)}
              sx={{ color: useField('continent').value === '' ? 'muted' : '' }}
            >
              <option value="" selected disabled hidden>
                Month
              </option>
              {months.map(month => (
                <option key={month} value={month}>
                  {allMonths[month - 1]}
                </option>
              ))}
            </Select>
          </Label>
          <Label>
            &nbsp;
            <Select
              required
              onChange={e => setDay(e.target.value)}
              sx={{ color: useField('continent').value === '' ? 'muted' : '' }}
            >
              <option value="" selected disabled hidden>
                Day
              </option>
              {days.map(day => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </Select>
          </Label>
          <Label>
            &nbsp;
            <Select
              required
              onChange={e => setYear(e.target.value)}
              sx={{ color: useField('continent').value === '' ? 'muted' : '' }}
            >
              <option value="" selected disabled hidden>
                Year
              </option>
              <option value="middle" disabled hidden>
                Hi, I'm hidden!&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;
              </option>
              {years
                .map(year => (
                  <option key={year} value={year}>
                    {year}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </option>
                ))
                .reverse()}
            </Select>
          </Label>
        </Grid>
        <Label>
          Why do you want to join the Hack Club Slack?
          <Textarea
            {...useField('reason')}
            placeholder="Write a few sentences."
            required
          />
        </Label>
        {/*{isAdult && (
          <Text
            variant="caption"
            color="secondary"
            as="div"
            sx={{ maxWidth: '600px', textAlign: 'center', mb: 2 }}
          >
            Hold your horses! <b>Our Slack community is for minors</b>! To find
            out more about what all we do, check out our{' '}
            <Link href="https://github.com/hackclub"> Github </Link>. If you're
            a parent or educator & want to talk to a member of our team, send us
            a email at{' '}
            <Link href="mailto:team@hackclub.com">team@hackclub.com</Link>.
          </Text>
        )}*/}
        <Box>
          <Submit
            status={status}
            mt={'0px!important'}
            labels={{
              default: useWaitlist ? 'Join Waitlist' : 'Get Invite',
              error: 'Something went wrong',
              success: useWaitlist
                ? "You're on the Waitlist!"
                : 'Check your email for invite!'
            }}
            disabled={status === 'loading' || status === 'success'}
          />
          {status === 'success' && !useWaitlist && (
            <Text
              variant="caption"
              color="secondary"
              as="div"
              sx={{
                maxWidth: '600px',
                textAlign: 'center',
                mt: 3
              }}
            >
              Search for "Slack" in your mailbox! Not there?{' '}
              <Link href="mailto:slack@hackclub.com" sx={{ ml: 1 }}>
                Send us an email
              </Link>
            </Text>
          )}
        </Box>
      </form>
    </Card>
  )
}

export default JoinForm
